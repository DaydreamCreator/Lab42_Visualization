#!/bin/bash
mongorestore --db room_data_lab42 --archive=/docker-entrypoint-initdb.d/database_backup.archive --gzip --drop