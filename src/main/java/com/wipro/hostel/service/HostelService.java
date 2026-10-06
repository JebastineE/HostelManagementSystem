package com.wipro.hostel.service;

import com.wipro.hostel.entity.Hostel;
import com.wipro.hostel.exception.ResourceNotFoundException;
import com.wipro.hostel.repository.HostelRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class HostelService {

    private final HostelRepository hostelRepository;

    public HostelService(HostelRepository hostelRepository) {
        this.hostelRepository = hostelRepository;
    }

    public List<Hostel> getAllHostels() {
        return hostelRepository.findAll();
    }

    public Hostel getHostelById(Integer hostelId) {
        return hostelRepository.findById(hostelId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hostel with ID " + hostelId + " not found"
                ));
    }

    public Hostel addHostel(Hostel hostel) {
        return hostelRepository.save(hostel);
    }

    public Hostel updateHostel(Integer hostelId, Hostel hostel) {

        Hostel existingHostel = getHostelById(hostelId);

        existingHostel.setHostelName(hostel.getHostelName());
        existingHostel.setHostelType(hostel.getHostelType());
        existingHostel.setLocation(hostel.getLocation());
        existingHostel.setMonthlyFee(hostel.getMonthlyFee());

        return hostelRepository.save(existingHostel);
    }

    public void deleteHostel(Integer hostelId) {
        Hostel existingHostel = getHostelById(hostelId);
        hostelRepository.delete(existingHostel);
    }
    public BigDecimal calculateHostelFee(Integer hostelId,
            							Integer durationMonths) {

    	return hostelRepository.calculateHostelFee(
    			hostelId,
    			durationMonths
    	);
    }
}