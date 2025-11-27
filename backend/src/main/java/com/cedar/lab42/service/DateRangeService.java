package com.cedar.lab42.service;

import com.cedar.lab42.model.DateRange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class DateRangeService {

    @Autowired
    private MongoTemplate mongoTemplate;

   
    /* 
    Get the date range by room id
    */
    public List<DateRange> getDateRangeByRoomId(Integer roomid) {
        Query query = new Query(Criteria.where("roomid").is(roomid));
        return mongoTemplate.find(query, DateRange.class);
    }


} 