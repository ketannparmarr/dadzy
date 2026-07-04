variable "project_id" {
  description = "The GCP Project ID where resources will be provisioned."
  type        = string
}

variable "region" {
  description = "The GCP region for the Cloud Run and Cloud SQL deployment."
  type        = string
  default     = "us-central1"
}

variable "vpc_name" {
  description = "The name of the VPC network to create/use."
  type        = string
  default     = "dadzy-vpc"
}

variable "db_password" {
  description = "Password for the PostgreSQL root user."
  type        = string
  sensitive   = true
}

variable "frontend_image" {
  description = "The Docker image path for the combined Vite/Express frontend."
  type        = string
}

variable "medusa_image" {
  description = "The Docker image path for the headless Medusa.js backend."
  type        = string
}

variable "environment" {
  description = "The deployment environment (staging or production)."
  type        = string
  default     = "production"
}
