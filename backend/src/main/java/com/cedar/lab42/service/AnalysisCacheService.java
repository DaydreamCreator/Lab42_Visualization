package com.cedar.lab42.service;
import org.springframework.beans.factory.annotation.Value;
import com.cedar.lab42.model.AnalysisCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;



@Service
public class AnalysisCacheService {

    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${ai.service.url:http://127.0.0.1:5000}")
    private String aiServiceUrl;

// TODO: improve the process of passing the sequence to the flask api
    public String getAnalysisResult(Integer category, Integer roomid, String date, String attribute, List<Float> sequence, Integer floor, Integer cluster) {
        // query the flask api to get the analysis result
        String url = aiServiceUrl + "/analyze";
        String model = "GPT-4.1 nano";
        
        // create the request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("category", category);
        requestBody.put("roomid", roomid);
        requestBody.put("date", date);
        requestBody.put("attribute", attribute);
        requestBody.put("sequence", sequence);
        requestBody.put("model", model);
        requestBody.put("floor", floor);
        requestBody.put("cluster", cluster);
        // create the request header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        // create the request entity
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        // send the request
        String result = restTemplate.postForObject(url, entity, String.class);
        System.out.println("Analysis result: " + result);
        return result;
    }
} 