#!/usr/bin/env bash

# Drops and recreates the PostgreSQL database, then runs migrations

set -e

DB_SUPERUSER="postgres"
APP_DB_USER="qshift"
APP_DB_NAME="qshift"

echo "[db_reset] This will DROP and RECREATE database '$APP_DB_NAME'."
read -r -p "Type 'y' to continue: " CONFIRM

if [ "$CONFIRM" != "y" ]; then
  echo "[db_reset] Aborted."
  exit 0
fi

echo "[db_reset] Dropping database '$APP_DB_NAME' (if it exists)..."
sudo -u "$DB_SUPERUSER" dropdb --if-exists "$APP_DB_NAME"

echo "[db_reset] Creating database '$APP_DB_NAME' owned by '$APP_DB_USER'..."
sudo -u "$DB_SUPERUSER" createdb -O "$APP_DB_USER" "$APP_DB_NAME"

# Run migrations
SCRIPT_DIR="$(dirname "$0")"
"$SCRIPT_DIR/migrate_db.sh"

echo "[db_reset] OK."
