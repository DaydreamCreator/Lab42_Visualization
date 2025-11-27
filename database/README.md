## Database Setup

### Exporting Database (Dev Mode)

```bash
# export the whole db
mongodump --db your_database --archive=database_backup.archive --gzip
```

### Importing Database

#### Prerequisites
1. Make sure MongoDB Installed
2. Make sure the service of MongoDB is running

#### Method 1: Use Script

**macOS/Linux:**
```bash
chmod +x import_database.sh
./import_database.sh database_backup.archive
```

**Windows:**
```bash
import_database.bat database_backup.archive
```

#### Method 2: Import by manual
```bash
mongorestore --db your_database --archive=database_backup.archive --gzip --drop
```

**Notice**: `--drop` will delete the current data in object db, please be careful

### Verify the importing results

After importing：
```bash
# Connect to MongoDB
mongosh

# switch to the db
use your_database

# show all 
show collections

# show the documents of one db
db.your_collection.countDocuments()

# show example data of one db
db.your_collection.findOne()
```
```