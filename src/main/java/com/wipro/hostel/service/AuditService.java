package com.wipro.hostel.service;

import com.wipro.hostel.entity.AuditLog;
import com.wipro.hostel.exception.ResourceNotFoundException;
import com.wipro.hostel.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    public AuditLog getAuditLogById(Long auditId) {
        return auditLogRepository.findById(auditId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Audit log with ID " + auditId + " not found"
                ));
    }
}