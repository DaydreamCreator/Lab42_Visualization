package com.cedar.lab42.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.Instant;

@Data
@Document(collection = "clusterData")
public class Cluster {
    @Id
    private String id;
    private String attribute;
    private String date;
    private Integer roomid;
    private Integer floor;
    private Integer nclusters;
    private Integer cluster;

    public Integer getClusterId() {
        return cluster;
    }

    public Integer getRoomid() {
        return roomid;
    }

    public Integer getNclusters() {
        return nclusters;
    }

    public void setClusterId(Integer cluster) {
        this.cluster = cluster;
    }
} 

