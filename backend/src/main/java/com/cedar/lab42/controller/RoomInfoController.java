package com.cedar.lab42.controller;

import com.cedar.lab42.model.RoomInfo;
import com.cedar.lab42.model.DateRange;
import com.cedar.lab42.service.RoomInfoService;
import com.cedar.lab42.service.DateRangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/roominfo")
@CrossOrigin(origins = "*")
public class RoomInfoController {

    @Autowired
    private RoomInfoService roomInfoService;

    @Autowired
    private DateRangeService dateRangeService;

    @GetMapping("/{floor}")
    public List<RoomInfo> getRoomsByFloor(@PathVariable Integer floor) {
        return roomInfoService.getInfoByFloor(floor);
    }

    @GetMapping("/all")
    public List<RoomInfo> getAllRooms() {
        return roomInfoService.getAllRooms();
    }

    @GetMapping("/daterange/{roomid}")
    public List<DateRange> getDateRangeByRoomId(@PathVariable Integer roomid) {
        return dateRangeService.getDateRangeByRoomId(roomid);
    }
} 