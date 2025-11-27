package com.cedar.lab42.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.Instant;

@Data
@Document(collection = "clusterTrends")
public class ClusterTrends {
    @Id
    private String id;
    private String attribute;
    private Integer floor;
    private Integer cluster;
    private Integer time_slot;
    private Double mean_ts;
    private Double std_ts;
} 
