package com.wipro.hostel.repository;

import com.wipro.hostel.entity.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AllocationRepository extends JpaRepository<Allocation, Integer> {

    @Query(value = """
            SELECT
                a.allocation_id AS allocationId,
                s.student_id AS studentId,
                s.name AS studentName,
                s.course AS course,
                h.hostel_name AS hostelName,
                h.hostel_type AS hostelType,
                r.room_number AS roomNumber,
                a.allocated_date AS allocatedDate,
                a.duration_months AS durationMonths
            FROM allocations a
            JOIN students s
                ON a.student_id = s.student_id
            JOIN rooms r
                ON a.room_id = r.room_id
            JOIN hostels h
                ON r.hostel_id = h.hostel_id
            ORDER BY a.allocation_id
            """, nativeQuery = true)
    List<Object[]> findStudentRoomAllocations();

    @Modifying
    @Transactional
    @Query(value = "CALL allocate_room(:studentId, :roomId, :durationMonths)", nativeQuery = true)
    void allocateRoom(
            @Param("studentId") Integer studentId,
            @Param("roomId") Integer roomId,
            @Param("durationMonths") Integer durationMonths
    );
}