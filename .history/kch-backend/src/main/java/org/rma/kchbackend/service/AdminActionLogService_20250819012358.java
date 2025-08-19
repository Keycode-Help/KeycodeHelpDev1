package org.rma.kchbackend.service;

import org.rma.kchbackend.model.AdminActionLog;
import org.rma.kchbackend.repository.AdminActionLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminActionLogService {
    private final AdminActionLogRepository repository;

    public AdminActionLogService(AdminActionLogRepository repository) {
        this.repository = repository;
    }

    public void log(String adminEmail, String action, Long targetUserId, String details) {
        AdminActionLog log = new AdminActionLog();
        log.setAdminEmail(adminEmail);
        log.setAction(action);
        log.setTargetUserId(targetUserId);
        log.setDetails(details);
        repository.save(log);
    }
}


