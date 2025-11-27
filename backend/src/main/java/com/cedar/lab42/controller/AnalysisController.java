package com.cedar.lab42.controller;

import com.cedar.lab42.model.AnalysisRequest;
import com.cedar.lab42.service.AnalysisCacheService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*")
public class AnalysisController {

    @Autowired
    private AnalysisCacheService analysisCacheService;

    @PostMapping("{category}/{floor}/{roomNumber}")       
    public ResponseEntity<String> getAnalysisResult(@PathVariable Integer category, @PathVariable Integer floor, @PathVariable Integer roomNumber, @RequestBody AnalysisRequest request) {
        System.out.println("Received request for floor: " + floor + ", roomNumber: " + roomNumber + ", attribute: " + request.getAttribute() + ", date: " + request.getDate());
        //System.out.println("Sequence: " + request.getSequence());
        return ResponseEntity.ok(analysisCacheService.getAnalysisResult(category, roomNumber, request.getDate(), request.getAttribute(), request.getSequence(), floor, request.getCluster()));
    }
  
} 