package com.wipro.hostel.controller;

import com.wipro.hostel.entity.Hostel;
import com.wipro.hostel.service.HostelService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/hostels")
@CrossOrigin(origins = "*")
public class HostelController {

    private final HostelService hostelService;

    public HostelController(HostelService hostelService) {
        this.hostelService = hostelService;
    }

    @GetMapping
    public List<Hostel> getAllHostels() {
        return hostelService.getAllHostels();
    }

    @GetMapping("/{id}")
    public Hostel getHostelById(@PathVariable Integer id) {
        return hostelService.getHostelById(id);
    }

    @PostMapping
    public Hostel addHostel(@RequestBody Hostel hostel) {
        return hostelService.addHostel(hostel);
    }

    @PutMapping("/{id}")
    public Hostel updateHostel(
            @PathVariable Integer id,
            @RequestBody Hostel hostel) {

        return hostelService.updateHostel(id, hostel);
    }

    @DeleteMapping("/{id}")
    public String deleteHostel(@PathVariable Integer id) {

        hostelService.deleteHostel(id);

        return "Hostel deleted successfully";
    }

    @GetMapping("/{id}/fee")
    public BigDecimal calculateHostelFee(
            @PathVariable Integer id,
            @RequestParam Integer months) {

        return hostelService.calculateHostelFee(id, months);
    }
}