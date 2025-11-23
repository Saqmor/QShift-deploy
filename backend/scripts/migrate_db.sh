#!/usr/bin/env bash

# Applies Alembic migrations to the database

set -e

# Root of the backend (parent of scripts/)
ROOT_DIR="$(dirname "$0")/.."
pushd "$ROOT_DIR"

echo "[db_migrate] Applying migrations to default database (settings.DATABASE_URL)..."

alembic upgrade head

popd

echo "[db_migrate] OK."
