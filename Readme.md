## Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) Installed


## Option 1: Initial setup with packed images (with Docker installed and started)
1. Clone the repo.
```
git clone git@github.com:DaydreamCreator/Lab42_Visualization.git
```
2. Load the packed image, with put the images under the root directory.
```
docker load -i app-images.tar
```
3. Put the `database_backup.archive` databse to `database` directory, AND create the `.env` file under the `aiservice` directory and set with UTF-8 format
```
echo OPENAI_API_KEY=your_key | Out-File -Encoding UTF8 aiservice\.env 
```
4. Start and launch all services 
```
docker-compose up
```
5. Explore the application at http://localhost/.


## Option 2: Initial setup with Docker images downloaded
1. Clone the repo.
```
git clone git@github.com:DaydreamCreator/Lab42_Visualization.git
```
2. Put the `database_backup.archive` databse to `database` directory, AND create the `.env` file under the `aiservice` directory and set with UTF-8 format
```
echo OPENAI_API_KEY=your_key > aiservice\.env
```
3. Start and launch all services
```
docker-compose up build
```
4. Explore the application at http://localhost/.
## Other commands

### Show the running status
(under the project root directory)
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


## 📁 Project Structure

```
Lab42_Visualization/
├── aiservice/                   # Backend API and ML components
│   ├── app.py                   # Flask application for AI Service
│   ├── ai_service.py               
│   ├── env/
│   ├── Dockerfile            
│   └── requirements.txt         # Python dependencies  
├── backend/                   # Backend Spring Boot API
│   ├── src/
│   │   ├── main/java/com/cedar/lab42/
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── RestTemplateConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AnalysisController.java
│   │   │   │   ├── ClusterController.java
│   │   │   │   ├── RoomController.java
│   │   │   │   └── RoomInfoController.java
│   │   │   ├── model/
│   │   │   │   ├── AnalysisCache.java
│   │   │   │   ├── AnalysisRequest.java
│   │   │   │   ├── Cluster.java
│   │   │   │   ├── ClusterDistribution.java
│   │   │   │   ├── ClusterInfo.java
│   │   │   │   ├── ClusterTrends.java
│   │   │   │   ├── DateRange.java
│   │   │   │   ├── Room.java
│   │   │   │   ├── RoomInfo.java
│   │   │   │   └── SensorData.java
│   │   │   ├── repository/
│   │   │   │   └── RoomRepository.java
│   │   │   ├── service/
│   │   │   │   └── Lab42BackendApplication.java
│   │   │   ├── resources/             
│   │   │   │   └── application.properties
│   ├── Dockerfile
├── frontend/                  # Frontend web application
│   ├── public/                # Static assets
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   │   ├── DataComponents
│   │   │   │   ├── ChartCompare.tsx
│   │   │   │   ├── ChartData.tsx
│   │   │   │   ├── CompareData.tsx
│   │   │   │   ├── DataSimilarRooms.tsx
│   │   │   │   ├── RoomDetails.tsx
│   │   │   ├── PatternComponents
│   │   │   │   ├── ClusterDetails.tsx
│   │   │   │   ├── ClusterSimilarRooms.tsx
│   │   │   │   ├── CompareCluster.tsx
│   │   │   │   ├── TrendChart.tsx
│   │   │   ├── DetailHeader.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Floorfirst.tsx
│   │   │   ├── Floorfourth.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Timepicker.tsx
│   │   ├── hooks/          
│   │   │   └── useRoomData.ts
│   │   ├── pages/          
│   │   │   ├── Data.tsx
│   │   │   └── Pattern.tsx
│   │   ├── services/         # API service functions
│   │   │   └── api.ts
│   │   ├── store/
│   │   │   ├── allRoomInfoSlice.ts
│   │   │   ├── attributeMapSlice.ts
│   │   │   ├── attributeSlice.ts
│   │   │   ├── chartDataSlice.ts
│   │   │   ├── clusterColorSlice.ts
│   │   │   ├── clusterMapSlice.ts
│   │   │   ├── clusterSlice.ts
│   │   │   ├── floorColorSlice.ts
│   │   │   ├── floorSlice.ts
│   │   │   ├── index.ts
│   │   │   ├── multipleClickSlice.ts
│   │   │   ├── patternSlice.ts
│   │   │   ├── roomIdMapSlice.ts
│   │   │   ├── roomIdSlice.ts
│   │   │   ├── roomInfoSlice.ts
│   │   │   └── timeSlice.ts
│   │   ├── types/
│   │   │   ├── clusterTypes.tsx
│   │   │   ├── roomType.tsx
│   │   │   └── sensorType.tsx
│   │   ├── utils/
│   │   │   ├── colorUtils.ts
│   │   │   └── findSimilarRooms.ts
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── App.tsx           # Main application component
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── LICENS
│   ├── package-lock.json
│   ├── package.json
│   ├── requirements.txt
│   ├── README.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── Dockerfile
├── database/                        # Database directory
│   ├── database_backup.archive      # Need import by hand
│   ├── import_database.bat
│   ├── import_database.sh
│   ├── init-mongo.sh
│   ├── README.md
├── processdata/                     # Sample datasets and outputs
│   ├── fill_missing_data_fourth.py
│   ├── make_dataset.py
│   ├── plot_trend.py
│   ├── save_cluster.py
│   ├── train_model.py
│   ├── write_to_db.py
│   └── make_cluster.py
├── docs/                     # Documentation
│   ├── API.md               # API documentation
│   └── USAGE.md             # Usage guide
├── docker-compose.yml       # Docker configuration 
├── app-images.tar           # Need import by hand
├── import_database.sh
└── LocalDevSetup.md




### Reimport the database
```
docker cp database_backup.archive mongodb:/tmp/
docker exec -it mongodb mongorestore --archive=/tmp/database_backup.archive --gzip --drop
```
