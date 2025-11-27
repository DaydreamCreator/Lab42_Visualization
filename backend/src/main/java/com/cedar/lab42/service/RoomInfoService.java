package com.cedar.lab42.service;

import com.cedar.lab42.model.RoomInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class RoomInfoService {

    @Autowired
    private MongoTemplate mongoTemplate;

    /* 
    Get all the room info
    */
    public List<RoomInfo> getAllRooms() {
        return mongoTemplate.findAll(RoomInfo.class);
    }

    /* 
    Get the room info by floor
    */
    public List<RoomInfo> getInfoByFloor(Integer floor) {
        //Query query = new Query(Criteria.where("room_name").regex("^L" + floor));
        Query query = new Query(Criteria.where("floor").is(floor));
        return mongoTemplate.find(query, RoomInfo.class);
    }


    public RoomInfo getRoomInfoByRoomId(Integer roomid) {
        Query query = new Query(Criteria.where("room_id").is(roomid));
        return mongoTemplate.findOne(query, RoomInfo.class);
    }

} 