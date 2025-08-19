package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.AdminActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminActionLogRepository extends JpaRepository<AdminActionLog, Long> {
}


