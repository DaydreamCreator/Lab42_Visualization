package com.cedar.lab42.service;

import com.cedar.lab42.model.Cluster;
import com.cedar.lab42.model.RoomInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
@Service
public class ClusterService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private RoomInfoService roomInfoService;

    public List<Cluster> getClusterByFloorAndDate(Integer floor, String attribute, String date) {
        //temperature_cluster_3_floor_1
        Query query = new Query();
        query.addCriteria(Criteria.where("floor").is(floor));
        query.addCriteria(Criteria.where("date").is(date));
        query.addCriteria(Criteria.where("attribute").is(attribute));
        return mongoTemplate.find(query, Cluster.class);
    }

    public Integer getClusterNumber(Integer floor, String date, String attribute) {
        Query query = new Query();
        query.addCriteria(Criteria.where("floor").is(floor));
        query.addCriteria(Criteria.where("date").is(date));
        query.addCriteria(Criteria.where("attribute").is(attribute));
        Cluster cluster = mongoTemplate.findOne(query, Cluster.class);
        return cluster.getNclusters();
    }

    public Map<String, List<Integer>> findSimilarRooms(Integer floor, String date, Integer roomid) {
        
        Map<String, List<Integer>> similarRooms = new HashMap<>();

        // query the sensor availability of the room
        RoomInfo roomInfo = roomInfoService.getRoomInfoByRoomId(roomid);
        //System.out.println(roomInfo);
        Map<String, Integer> sensorAvailability = (Map<String, Integer>) roomInfo.getSensor_availability();

        for (Map.Entry<String, Integer> entry : sensorAvailability.entrySet()) {
            String sensor = entry.getKey();
            Integer availability = entry.getValue();
            //System.out.println(sensor + " " + availability);
            if (availability == 1){
                Query query = new Query();
                query.addCriteria(Criteria.where("floor").is(floor));
                query.addCriteria(Criteria.where("date").is(date));
                query.addCriteria(Criteria.where("attribute").is(sensor));

                List<Cluster> clusters = mongoTemplate.find(query, Cluster.class);
                Integer clusterId = -1;


                for (Cluster cluster : clusters) {
                    if (roomid.equals(cluster.getRoomid())) {
                        clusterId = cluster.getClusterId();
                        break;  
                    }
                }
                if (clusterId == -1) {
                    System.out.println("Error: roomid not found");
                    return new HashMap<>();
                }
                List<Integer> similarRoomsforSensor = new ArrayList<>();
                for (Cluster cluster : clusters) {
                    if (cluster.getClusterId() == clusterId && cluster.getRoomid() != roomid) {
                        similarRoomsforSensor.add(cluster.getRoomid());
                    }
                }
                similarRooms.put(sensor, similarRoomsforSensor);
                
            }
        }

        

        return similarRooms;

    }
} 