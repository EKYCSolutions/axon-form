#!/bin/sh
set -e

if [ -n "$PB_SUPERUSER_EMAIL" ] && [ -n "$PB_SUPERUSER_PASSWORD" ]; then
    echo "Ensuring PocketBase superuser account exists..."
    /pb/pocketbase superuser upsert "$PB_SUPERUSER_EMAIL" "$PB_SUPERUSER_PASSWORD"
else
    echo "PB_SUPERUSER_EMAIL / PB_SUPERUSER_PASSWORD not set, skipping superuser seeding."
fi

exec /pb/pocketbase serve --http=0.0.0.0:8080
