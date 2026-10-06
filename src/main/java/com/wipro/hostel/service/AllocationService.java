package com.wipro.hostel.service;

import com.wipro.hostel.entity.Allocation;
import com.wipro.hostel.exception.ResourceNotFoundException;
import com.wipro.hostel.repository.AllocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AllocationService {

    private final AllocationRepository allocationRepository;

    public AllocationService(AllocationRepository allocationRepository) {
        this.allocationRepository = allocationRepository;
    }

    public List<Allocation> getAllAllocations() {
        return allocationRepository.findAll();
    }

    public Allocation getAllocationById(Integer allocationId) {
        return allocationRepository.findById(allocationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Allocation with ID " + allocationId + " not found"
                ));
    }
    
    public void allocateRoom(Integer studentId,
    						 Integer roomId,
    						 Integer durationMonths) {

    	allocationRepository.allocateRoom(
    			studentId,
    			roomId,
    			durationMonths
    	);
    }

    public Allocation addAllocation(Allocation allocation) {
        return allocationRepository.save(allocation);
    }

    public Allocation updateAllocation(Integer allocationId,
                                       Allocation allocation) {

        Allocation existingAllocation =
                getAllocationById(allocationId);

        existingAllocation.setStudentId(allocation.getStudentId());
        existingAllocation.setRoomId(allocation.getRoomId());
        existingAllocation.setAllocatedDate(allocation.getAllocatedDate());
        existingAllocation.setDurationMonths(allocation.getDurationMonths());

        return allocationRepository.save(existingAllocation);
    }

    public void deleteAllocation(Integer allocationId) {
        Allocation existingAllocation =
                getAllocationById(allocationId);

        allocationRepository.delete(existingAllocation);
    }

    public List<Object[]> getStudentRoomAllocations() {
        return allocationRepository.findStudentRoomAllocations();
    }
}