package com.wipro.hostel.controller;

import com.wipro.hostel.entity.Allocation;
import com.wipro.hostel.service.AllocationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
@CrossOrigin(origins = "*")
public class AllocationController {

    private final AllocationService allocationService;

    public AllocationController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @GetMapping
    public List<Allocation> getAllAllocations() {
        return allocationService.getAllAllocations();
    }

    @GetMapping("/{id}")
    public Allocation getAllocationById(@PathVariable Integer id) {
        return allocationService.getAllocationById(id);
    }

    @PostMapping
    public Allocation addAllocation(@RequestBody Allocation allocation) {
        return allocationService.addAllocation(allocation);
    }

    @PutMapping("/{id}")
    public Allocation updateAllocation(
            @PathVariable Integer id,
            @RequestBody Allocation allocation) {

        return allocationService.updateAllocation(id, allocation);
    }

    @DeleteMapping("/{id}")
    public String deleteAllocation(@PathVariable Integer id) {

        allocationService.deleteAllocation(id);

        return "Allocation deleted successfully";
    }

    @GetMapping("/student-room")
    public List<Object[]> getStudentRoomAllocations() {
        return allocationService.getStudentRoomAllocations();
    }

    @PostMapping("/allocate")
    public String allocateRoom(
            @RequestParam Integer studentId,
            @RequestParam Integer roomId,
            @RequestParam Integer durationMonths) {

        allocationService.allocateRoom(
                studentId,
                roomId,
                durationMonths
        );

        return "Room allocated successfully";
    }
}