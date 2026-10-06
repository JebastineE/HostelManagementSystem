package com.wipro.hostel.controller;

import com.wipro.hostel.entity.AuditLog;
import com.wipro.hostel.service.AuditService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public List<AuditLog> getAllAuditLogs() {
        return auditService.getAllAuditLogs();
    }

    @GetMapping("/{id}")
    public AuditLog getAuditLogById(@PathVariable Long id) {
        return auditService.getAuditLogById(id);
    }
}