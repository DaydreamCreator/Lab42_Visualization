package com.cedar.lab42.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.Instant;
import java.util.Map;
@Data
@Document(collection = "roomInfo")
public class RoomInfo {
    @Id
    private String id;
    private String room_name;
    private Integer room_id;
    private Integer floor;
    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    private Object room_sensors;
    private String description;
    private Double area;
    private String type;

    public Object getSensor_availability() {
        return room_sensors;
    }
} 