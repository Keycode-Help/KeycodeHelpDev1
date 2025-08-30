package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.EtlLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EtlLogRepository extends JpaRepository<EtlLog, Long> {
}
