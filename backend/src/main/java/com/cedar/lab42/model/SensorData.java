package com.cedar.lab42.model;

import java.time.Instant;

public class SensorData {
    private Integer roomid;
    private Double temperature;
    private Double airquality;
    private Double daylight;
    private Double light;
  
    public Integer getRoomid() {
        return roomid;
    }

    public void setRoomid(Integer roomid) {
        this.roomid = roomid;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getAirquality() {
        return airquality;
    }

    public void setAirquality(Double airquality) {
        this.airquality = airquality;
    }

    public Double getDaylight() {
        return daylight;
    }

    public void setDaylight(Double daylight) {
        this.daylight = daylight;
    }

    public Double getLight() {
        return light;
    }

    public void setLight(Double light) {
        this.light = light;
    }

} 