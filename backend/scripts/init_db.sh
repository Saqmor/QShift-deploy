#!/usr/bin/env bash

# Creates PostgreSQL user and database

set -e

DB_SUPERUSER="postgres"

# These values must be set accordingly in the .env file
APP_DB_USER="qshift"
APP_DB_PASSWORD="qshift"
APP_DB_NAME="qshift"

USER_EXISTS=$(
  sudo -u "$DB_SUPERUSER" psql -tAc \
  "SELECT 1 FROM pg_roles WHERE rolname = '$APP_DB_USER'"
)

if [ "$USER_EXISTS" = "1" ]; then
    echo "[db_init] User '$APP_DB_USER' already exists."
else
    echo "[db_init] Creating user '$APP_DB_USER'..."
    sudo -u "$DB_SUPERUSER" psql -c \
    "CREATE USER $APP_DB_USER WITH PASSWORD '$APP_DB_PASSWORD';"
fi

DB_EXISTS=$(
    sudo -u "$DB_SUPERUSER" psql -tAc \
    "SELECT 1 FROM pg_database WHERE datname = '$APP_DB_NAME'"
)

if [ "$DB_EXISTS" = "1" ]; then
    echo "[db_init] Database '$APP_DB_NAME' already exists."
else
    echo "[db_init] Creating database '$APP_DB_NAME'..."
    sudo -u "$DB_SUPERUSER" createdb -O "$APP_DB_USER" "$APP_DB_NAME"
fi

echo "[db_init] OK."
