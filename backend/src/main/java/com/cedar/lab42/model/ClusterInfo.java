package com.cedar.lab42.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.Instant;

@Data
@Document(collection = "clusterInfo")
public class ClusterInfo {
    @Id
    private String id;
    private String attribute;
    private Integer floor;
    private Integer cluster;
    private Integer count;
    private Double mean;
    private Double std;
    private Double min;
    private Double max;
} 