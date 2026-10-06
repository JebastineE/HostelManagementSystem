package com.wipro.hostel.repository;

import com.wipro.hostel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {

    @Query(value = """
            SELECT *
            FROM rooms
            WHERE occupancy > (
                SELECT AVG(occupancy)
                FROM rooms
            )
            """, nativeQuery = true)
    List<Room> findRoomsAboveAverageOccupancy();
}