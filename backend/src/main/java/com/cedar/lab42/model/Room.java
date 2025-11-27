package com.cedar.lab42.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Document(collection = "roomData")
public class Room {
    @Id
    private String id;
    private Integer roomid;
    private String date;
    private Integer floor;
    private List<SensorData> sensor_data;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getRoomid() {
        return roomid;
    }

    public void setRoomid(Integer roomid) {
        this.roomid = roomid;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public List<SensorData> getSensor_data() {
        return sensor_data;
    }

    public void setSensor_data(List<SensorData> sensor_data) {
        this.sensor_data = sensor_data;
    }
} 

