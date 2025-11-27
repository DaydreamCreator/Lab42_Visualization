## How to finish the initial setup
1. Clone the repo
```
git clone git@github.com:DaydreamCreator/Lab42_Visualization.git
```
2. Move and import the `database_backup.archive` databse to `database` directory

```
mongorestore --db room_data_lab42 --archive=database_backup.archive --gzip --drop
```
Please note the database name is `room_data_lab42`.
3. Create the `.env` file under the aiservice
```
echo "OPENAI_API_KEY=your_key" > .env
```

4. Start build and launch all services
```
docker-compose up -d --build
```
5. Explore the application at http://localhost/.

## Other commands

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
docker-compose down
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
