package com.wipro.hostel.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "allocations")
public class Allocation {

    @Id
    private Integer allocationId;

    private Integer studentId;

    private Integer roomId;

    private LocalDate allocatedDate;

    private Integer durationMonths;

    public Allocation() {
    }

    public Allocation(Integer allocationId, Integer studentId,
                      Integer roomId, LocalDate allocatedDate,
                      Integer durationMonths) {
        this.allocationId = allocationId;
        this.studentId = studentId;
        this.roomId = roomId;
        this.allocatedDate = allocatedDate;
        this.durationMonths = durationMonths;
    }

    public Integer getAllocationId() {
        return allocationId;
    }

    public void setAllocationId(Integer allocationId) {
        this.allocationId = allocationId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public LocalDate getAllocatedDate() {
        return allocatedDate;
    }

    public void setAllocatedDate(LocalDate allocatedDate) {
        this.allocatedDate = allocatedDate;
    }

    public Integer getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }
}