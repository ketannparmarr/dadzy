terraform {
  required_version = ">= 1.3.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# --- Network: VPC, Subnet, and Serverless Connector ---
resource "google_compute_network" "vpc" {
  name                    = "${var.vpc_name}-${var.environment}"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "${var.vpc_name}-subnet-${var.environment}"
  ip_cidr_range = var.environment == "production" ? "10.0.0.0/24" : "10.1.0.0/24"
  network       = google_compute_network.vpc.id
  region        = var.region
}

# Private Service Connection for Cloud SQL Private IP
resource "google_compute_global_address" "private_ip_alloc" {
  name          = "dadzy-ip-alloc-${var.environment}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_alloc.name]
}

# Serverless VPC Access Connector (Limit name length to 25 chars)
resource "google_vpc_access_connector" "connector" {
  name          = "dadzy-conn-${var.environment}"
  region        = var.region
  ip_cidr_range = var.environment == "production" ? "10.8.0.0/28" : "10.9.0.0/28"
  network       = google_compute_network.vpc.name
}

# --- Database: Private IP Cloud SQL PostgreSQL ---
resource "google_sql_database_instance" "postgres" {
  name             = "dadzy-postgres-db-${var.environment}"
  database_version = "POSTGRES_15"
  region           = var.region
  depends_on       = [google_service_networking_connection.private_vpc_connection]

  settings {
    # Scale Down: Use db-f1-micro for Staging, db-custom-1-3840 for Production
    tier = var.environment == "production" ? "db-custom-1-3840" : "db-f1-micro"
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc.id
    }
  }
}

resource "google_sql_database" "medusadb" {
  name     = "medusadb"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "db_user" {
  name     = "dadzy_admin"
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}

# --- Cloud Storage: High-Resolution Assets ---
resource "google_storage_bucket" "assets" {
  name     = "dadzy-assets-${var.project_id}-${var.environment}"
  location = var.region

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Grant public read permissions to GCS Bucket
resource "google_storage_bucket_iam_binding" "public_rule" {
  bucket = google_storage_bucket.assets.name
  role   = "roles/storage.objectViewer"
  members = [
    "allUsers",
  ]
}

# --- Cloud Run: Combined Frontend & Express Proxy ---
resource "google_cloud_run_v2_service" "frontend" {
  name     = "dadzy-frontend-${var.environment}"
  location = var.region

  template {
    # Scale Down staging instances (e.g. min instances 0 vs 1 for prod)
    max_instance_request_concurrency = var.environment == "production" ? 100 : 50

    containers {
      image = var.frontend_image
      
      env {
        name  = "NODE_ENV"
        value = var.environment
      }
      env {
        name  = "MEDUSA_BACKEND_URL"
        value = google_cloud_run_v2_service.medusa_backend.uri
      }
      
      resources {
        limits = {
          cpu    = var.environment == "production" ? "2" : "1"
          memory = var.environment == "production" ? "2Gi" : "1Gi"
        }
      }

      ports {
        container_port = 3000
      }
    }
    
    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "ALL_TRAFFIC"
    }
  }
}

# --- Cloud Run: Medusa.js Headless Backend ---
resource "google_cloud_run_v2_service" "medusa_backend" {
  name     = "dadzy-medusa-backend-${var.environment}"
  location = var.region

  template {
    max_instance_request_concurrency = var.environment == "production" ? 80 : 30

    containers {
      image = var.medusa_image

      env {
        name  = "DATABASE_URL"
        value = "postgresql://${google_sql_user.db_user.name}:${var.db_password}@${google_sql_database_instance.postgres.private_ip_address}:5432/${google_sql_database.medusadb.name}"
      }
      env {
        name  = "NODE_ENV"
        value = var.environment
      }

      resources {
        limits = {
          cpu    = var.environment == "production" ? "2" : "1"
          memory = var.environment == "production" ? "2Gi" : "1Gi"
        }
      }

      ports {
        container_port = 9000
      }
    }

    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "ALL_TRAFFIC"
    }
  }
}

# --- IAM: Allow Unauthenticated Access to Frontend ---
resource "google_cloud_run_service_iam_member" "public_frontend" {
  service  = google_cloud_run_v2_service.frontend.name
  location = google_cloud_run_v2_service.frontend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
