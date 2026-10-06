package com.wipro.hostel.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    private Integer roomId;

    private Integer hostelId;

    private String roomNumber;

    private Integer capacity;

    private Integer occupancy;

    public Room() {
    }

    public Room(Integer roomId, Integer hostelId, String roomNumber,
                Integer capacity, Integer occupancy) {
        this.roomId = roomId;
        this.hostelId = hostelId;
        this.roomNumber = roomNumber;
        this.capacity = capacity;
        this.occupancy = occupancy;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public Integer getHostelId() {
        return hostelId;
    }

    public void setHostelId(Integer hostelId) {
        this.hostelId = hostelId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getOccupancy() {
        return occupancy;
    }

    public void setOccupancy(Integer occupancy) {
        this.occupancy = occupancy;
    }
}