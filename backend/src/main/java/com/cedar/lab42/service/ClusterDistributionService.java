package com.cedar.lab42.service;

import com.cedar.lab42.model.ClusterDistribution;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClusterDistributionService {

    @Autowired
    private MongoTemplate mongoTemplate;
    
    

    public List<ClusterDistribution> getClusterDistributionByAttribute(String attribute, Integer floor, Integer roomid) {
        //temperature_cluster_3_floor_1
        Query query = new Query();
        query.addCriteria(Criteria.where("attribute").is(attribute));
        query.addCriteria(Criteria.where("floor").is(floor));
        query.addCriteria(Criteria.where("roomid").is(roomid));
        return mongoTemplate.find(query, ClusterDistribution.class);
    }

    
} 