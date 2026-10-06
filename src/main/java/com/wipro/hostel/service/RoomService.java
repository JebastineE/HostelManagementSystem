package com.wipro.hostel.service;

import com.wipro.hostel.entity.Room;
import com.wipro.hostel.exception.ResourceNotFoundException;
import com.wipro.hostel.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Integer roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Room with ID " + roomId + " not found"
                ));
    }

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(Integer roomId, Room room) {

        Room existingRoom = getRoomById(roomId);

        existingRoom.setHostelId(room.getHostelId());
        existingRoom.setRoomNumber(room.getRoomNumber());
        existingRoom.setCapacity(room.getCapacity());
        existingRoom.setOccupancy(room.getOccupancy());

        return roomRepository.save(existingRoom);
    }

    public void deleteRoom(Integer roomId) {
        Room existingRoom = getRoomById(roomId);
        roomRepository.delete(existingRoom);
    }

    public List<Room> getRoomsAboveAverageOccupancy() {
        return roomRepository.findRoomsAboveAverageOccupancy();
    }
}