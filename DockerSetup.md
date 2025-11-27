### Construct and launch all services
```
docker-compose up -d --build
```

### Show the running status
```
docker-compose ps
```
### Show logs
(show the last 50 records)
```
docker-compose logs backend | tail -50  
```

### Stop serive(s)
```
```

### Stop and Delete 
```
docker-compose down -v
```


#### Rebuild (if modified the code)
```
docker-compose build backend (or other)
```
### Reboot the service
```
docker-compose up -d backend
```
#### Check the database
```
docker exec -it mongodb mongosh
use room_data_lab42
db.roomData.findOne({floor: 1, roomid: 29})
db.dateRange.findOne({roomid: 29})
```



### Reimport the database
```
docker cp database_backup.archive mongodb:/tmp/
docker exec -it mongodb mongorestore --archive=/tmp/database_backup.archive --gzip --drop
```