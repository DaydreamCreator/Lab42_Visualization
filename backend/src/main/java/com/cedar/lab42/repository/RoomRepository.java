package com.cedar.lab42.repository;

import com.cedar.lab42.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    List<Room> findByDateBetween(String startDate, String endDate);
} 