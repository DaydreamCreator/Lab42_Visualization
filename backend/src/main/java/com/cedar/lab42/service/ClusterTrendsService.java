package com.cedar.lab42.service;

import com.cedar.lab42.model.ClusterTrends;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClusterTrendsService {

    @Autowired
    private MongoTemplate mongoTemplate;
    


    public List<ClusterTrends> getClusterTrendsByAttribute(String attribute, Integer floor, Integer cluster) {
        //temperature_cluster_3_floor_1
        Query query = new Query();
        query.addCriteria(Criteria.where("attribute").is(attribute));
        query.addCriteria(Criteria.where("floor").is(floor));
        query.addCriteria(Criteria.where("cluster").is(cluster));
        return mongoTemplate.find(query, ClusterTrends.class);
    }

    
} 