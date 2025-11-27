package com.cedar.lab42.controller;

import com.cedar.lab42.model.Room;
import com.cedar.lab42.model.SensorData;
import com.cedar.lab42.service.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/data/")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("{floor}/{roomNumber}")       // need TEST
    public ResponseEntity<List<Room>> getRoomDataByDate(
            @PathVariable Integer floor,
            @PathVariable Integer roomNumber,
            @RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        
        if (endDate != null) {
            // if endDate is provided, query the time range
            Instant startTime = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant endTime = endDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
            return ResponseEntity.ok(roomService.getRoomsByTimeRange(startTime, endTime, floor, roomNumber));
        } else {
            // if only one date is provided, query the single day data
            Instant timestamp = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
            return ResponseEntity.ok(roomService.getRoomDataByDate(timestamp, floor, roomNumber));
        }
    }

    @GetMapping("/{floor}")
    public ResponseEntity<List<SensorData>> getFloorDataByDate(
            @PathVariable Integer floor,
            @RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Instant timestamp = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
        return ResponseEntity.ok(roomService.getFloorDataByDate(timestamp, floor));
    }

    @GetMapping("/{floor}/multiple")
    public ResponseEntity<List<Room>> getMultipleRoomsDataByTimeRange(
            @PathVariable Integer floor,
            @RequestParam(name = "rooms", required = true) List<Integer> roomNumbers,
            @RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Instant startTime = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endTime = endDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        return ResponseEntity.ok(roomService.getMultipleRoomsDataByTimeRange(startTime, endTime, floor, roomNumbers));
    }
    
} 