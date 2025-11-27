package com.cedar.lab42.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.Instant;

@Data
@Document(collection = "analysisCache")
public class AnalysisCache {
    @Id
    private String id;
    private Integer category;   // 0: data, 1: pattern
    private String attribute;
    private String date;
    private Integer roomid;
    private Integer cluster;
    private Integer floor;
    private String ai_result;
    private String created_at;
    private String model_used;
    private String language;

    public String getAiResult() {
        return ai_result;
    }

    public Integer getRoomid() {
        return roomid;
    }

    public Integer getFloor() {
        return floor;
    }
    
    public String getCreatedAt() {
        return created_at;
    }

    public void setAiResult(String ai_result) {
        this.ai_result = ai_result;
    }
} 

