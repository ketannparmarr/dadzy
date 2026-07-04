#!/bin/bash
# DADZY Database Backup & DR Sync Script
# Runs daily to export a logical PostgreSQL dump and syncs with regional GCS bucket.

set -e

# Configuration
DB_HOST=${DB_HOST:-"127.0.0.1"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"dadzy_admin"}
DB_NAME=${DB_NAME:-"medusadb"}
BACKUP_DIR="/tmp/db_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_backup_${TIMESTAMP}.sql.gz"
GCS_BUCKET="gs://dadzy-db-backups-production"

echo "=== Starting PostgreSQL Backup for DADZY at $(date) ==="

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# 1. Perform logical pg_dump
echo "Creating logical backup dump..."
pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" | gzip > "${BACKUP_FILE}"

echo "Logical backup created successfully at: ${BACKUP_FILE}"

# 2. Upload to Google Cloud Storage
echo "Uploading backup file to GCP Storage: ${GCS_BUCKET}"
gsutil cp "${BACKUP_FILE}" "${GCS_BUCKET}/daily/"

# 3. Clean up local temp backups
rm -f "${BACKUP_FILE}"

# 4. Enforce Regional Retention Policy reminder
# Standard compliance: retain daily backups for 30 days.
# Note: Ensure GCS bucket lifecycle rule is active.
# Example GCS Lifecycle JSON Rule configuration:
# {
#   "rule": [
#     {
#       "action": {"type": "Delete"},
#       "condition": {"age": 30}
#     }
#   ]
# }

echo "=== Backup Process Completed Successfully ==="
