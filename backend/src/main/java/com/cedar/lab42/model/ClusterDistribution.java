package com.cedar.lab42.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.Instant;
import java.util.List;


@Data
@Document(collection = "clusterDistribution")
public class ClusterDistribution {
    @Id
    private String id;
    private String attribute;
    private Integer floor;
    private Integer roomid;
    private Integer nclusters;
    private List<Double> distribution;
} 