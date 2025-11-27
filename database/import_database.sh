#!/bin/bash
# for MacOS/Linux

# configuration
BACKUP_FILE=$1
DB_NAME="your_database"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./import_database.sh <backup file path>"
    echo "Example: ./import_database.sh ./mongodb_backup/backup_20240101_120000.archive"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: backup file does not exist: $BACKUP_FILE"
    exit 1
fi

echo "Start importing database: ${DB_NAME}"
echo "From file: ${BACKUP_FILE}"

# import database
mongorestore --db ${DB_NAME} --archive=${BACKUP_FILE} --gzip --drop

if [ $? -eq 0 ]; then
    echo "✅ Database imported successfully!"
else
    echo "❌ Database imported failed!"
    exit 1
fi