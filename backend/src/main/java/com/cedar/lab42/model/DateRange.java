package com.cedar.lab42.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.Instant;

@Data
@Document(collection = "dateRange")
public class DateRange {
    @Id
    private String id;
    private Integer roomid;
    private Integer floor;
    private String time_start;
    private String time_end;
} 