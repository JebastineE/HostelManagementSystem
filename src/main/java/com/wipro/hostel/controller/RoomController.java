package com.wipro.hostel.controller;

import com.wipro.hostel.entity.Room;
import com.wipro.hostel.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Integer id) {
        return roomService.getRoomById(id);
    }

    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return roomService.addRoom(room);
    }

    @PutMapping("/{id}")
    public Room updateRoom(
            @PathVariable Integer id,
            @RequestBody Room room) {

        return roomService.updateRoom(id, room);
    }

    @DeleteMapping("/{id}")
    public String deleteRoom(@PathVariable Integer id) {

        roomService.deleteRoom(id);

        return "Room deleted successfully";
    }

    @GetMapping("/above-average")
    public List<Room> getRoomsAboveAverageOccupancy() {
        return roomService.getRoomsAboveAverageOccupancy();
    }
}