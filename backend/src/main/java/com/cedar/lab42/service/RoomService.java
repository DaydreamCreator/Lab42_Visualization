package com.cedar.lab42.service;

import com.cedar.lab42.model.Room;
import com.cedar.lab42.model.SensorData;
import com.cedar.lab42.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.ArrayList;

@Service
public class RoomService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private RoomRepository roomRepository;

    /* 
    Get the room data by single date, floor, and roomid
    */
    public List<Room> getRoomDataByDate(Instant timestamp, Integer floor, Integer roomid) {
        LocalDate date = timestamp.atZone(java.time.ZoneId.systemDefault()).toLocalDate();
        String dateStr = date.format(DateTimeFormatter.ISO_DATE);
        //System.out.println("Query date string: " + dateStr);
        Query query = new Query(Criteria.where("date").is(dateStr).and("floor").is(floor).and("roomid").is(roomid));
        query.with(Sort.by(Sort.Direction.ASC, "time_slot"));
        //System.out.println("Query: " + query);
        List<Room> rooms = mongoTemplate.find(query, Room.class);
        //System.out.println("Results: " + rooms);
        return rooms;
    }

    /* 
    Get the floor data by single date and floor
    */
    public List<SensorData> getFloorDataByDate(Instant timestamp, Integer floor) {
        // query the data by date and floor
        LocalDate date = timestamp.atZone(java.time.ZoneId.systemDefault()).toLocalDate();
        String dateStr = date.format(DateTimeFormatter.ISO_DATE);
        Query query = new Query(Criteria.where("date").is(dateStr).and("floor").is(floor));
        List<Room> rooms = mongoTemplate.find(query, Room.class);
        
        // calculate the average of the sensor data
        List<SensorData> rooms_avg = new ArrayList<>();
        for (Room room : rooms) {
            if (room.getSensor_data() != null && !room.getSensor_data().isEmpty()) {
                double tempSum = 0, airSum = 0, lightSum = 0, daylightSum = 0;
                int tempCount = 0, airCount = 0, lightCount = 0, daylightCount = 0;
                
                for (SensorData sensor : room.getSensor_data()) {
                    if (sensor.getTemperature() != null) {
                        tempSum += sensor.getTemperature();
                        tempCount++;
                    }
                    if (sensor.getAirquality() != null) {
                        airSum += sensor.getAirquality();
                        airCount++;
                    }
                    if (sensor.getLight() != null) {
                        lightSum += sensor.getLight();
                        lightCount++;
                    }
                    if (sensor.getDaylight() != null) {
                        daylightSum += sensor.getDaylight();
                        daylightCount++;
                    }
                }
                
                // create a new SensorData object to store the average value
                SensorData averageData = new SensorData();
                averageData.setTemperature(tempCount > 0 ? tempSum / tempCount : null);
                averageData.setAirquality(airCount > 0 ? airSum / airCount : null);
                averageData.setLight(lightCount > 0 ? lightSum / lightCount : null);
                averageData.setDaylight(daylightCount > 0 ? daylightSum / daylightCount : null);
                averageData.setRoomid(room.getRoomid());
                // add the average value to the sensor_data list
                rooms_avg.add(averageData);
            }
        }
        //System.out.println(rooms);
        
        return rooms_avg;
    }
    
    /* 
    Get the floor data by date range, floor, and roomid
    */
    public List<Room> getRoomsByTimeRange(Instant startTime, Instant endTime, Integer floor, Integer roomid) {
        // get startDate and endDate
        LocalDate startDate = startTime.atZone(java.time.ZoneId.systemDefault()).toLocalDate();
        LocalDate endDate = endTime.atZone(java.time.ZoneId.systemDefault()).toLocalDate();
        
        // format dates as strings
        String startDateStr = startDate.format(DateTimeFormatter.ISO_DATE);
        String endDateStr = endDate.format(DateTimeFormatter.ISO_DATE);
        
        Query query = new Query(Criteria.where("date").gte(startDateStr).lte(endDateStr).and("floor").is(floor).and("roomid").is(roomid));

        return mongoTemplate.find(query, Room.class);
        
    }

    /* 
    Get the multiple rooms data by date range, floor, and roomid
    */
    public List<Room> getMultipleRoomsDataByTimeRange(Instant startTime, Instant endTime, Integer floor, List<Integer> roomids) {
        // get startDate and endDate
        LocalDate startDate = startTime.atZone(java.time.ZoneId.systemDefault()).toLocalDate();
        LocalDate endDate = endTime.atZone(java.time.ZoneId.systemDefault()).toLocalDate();
        
        // format dates as strings
        String startDateStr = startDate.format(DateTimeFormatter.ISO_DATE);
        String endDateStr = endDate.format(DateTimeFormatter.ISO_DATE);

        Query query = new Query(Criteria.where("date").gte(startDateStr).lte(endDateStr).and("floor").is(floor).and("roomid").in(roomids));

        return mongoTemplate.find(query, Room.class);
        
    }
} 
