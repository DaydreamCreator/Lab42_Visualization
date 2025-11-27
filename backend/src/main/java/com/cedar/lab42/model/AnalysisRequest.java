package com.cedar.lab42.model;

import java.util.List;

public class AnalysisRequest {
    private List<Float> sequence;
    private String attribute;
    private String date;
    private Integer cluster;
    public List<Float> getSequence() {
        return sequence;
    }

    public void setSequence(List<Float> sequence) {
        this.sequence = sequence;
    }

    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getCluster() {
        return cluster;
    }   

    public void setCluster(Integer cluster) {
        this.cluster = cluster;
    }
    
    
} 