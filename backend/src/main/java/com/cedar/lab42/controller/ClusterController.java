package com.cedar.lab42.controller;

import com.cedar.lab42.model.Cluster;
import com.cedar.lab42.model.ClusterTrends;
import com.cedar.lab42.model.ClusterDistribution;
import com.cedar.lab42.service.ClusterService;
import com.cedar.lab42.service.ClusterTrendsService;
import com.cedar.lab42.service.ClusterDistributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/cluster")
@CrossOrigin(origins = "*")
public class ClusterController {

    @Autowired
    private ClusterService clusterService;

    @Autowired
    private ClusterTrendsService clusterTrendsService;
    
    @Autowired
    private ClusterDistributionService clusterDistributionService;

    @GetMapping("/{floor}/{attribute}/{date}")
    public List<Cluster> getClusterByFloorAndAttributes(@PathVariable Integer floor, @PathVariable String attribute, @PathVariable String date) {
        return clusterService.getClusterByFloorAndDate(floor, attribute, date);
    }

    @GetMapping("/similar/{floor}/{roomid}/{date}")
    public Map<String, List<Integer>> findSimilarRooms(@PathVariable Integer floor,  @PathVariable String date, @PathVariable Integer roomid) {
        return clusterService.findSimilarRooms(floor, date, roomid);
    }

    @GetMapping("/num/{floor}/{date}/{attribute}")
    public Integer getClusterNumber(@PathVariable Integer floor, @PathVariable String date, @PathVariable String attribute) {
        return clusterService.getClusterNumber(floor, date, attribute);
    }

    @GetMapping("/trends/{attribute}/{floor}/{cluster}")
    public List<ClusterTrends> getClusterTrendsByAttribute(@PathVariable String attribute, @PathVariable Integer floor, @PathVariable Integer cluster) {
        return clusterTrendsService.getClusterTrendsByAttribute(attribute, floor, cluster);
    }

    @GetMapping("/distribution/{attribute}/{floor}/{roomid}")
    public List<ClusterDistribution> getClusterDistributionByAttribute(@PathVariable String attribute, @PathVariable Integer floor, @PathVariable Integer roomid) {
        return clusterDistributionService.getClusterDistributionByAttribute(attribute, floor, roomid);
    }

/*
    @GetMapping("/{floor}/{attributes}/{date}")
    public List<Cluster> getClusterByInput(@PathVariable String floor, @PathVariable String attributes, @PathVariable String date) {
        return clusterService.getClusterByInput(floor, attributes, date);
    }
*/
} 