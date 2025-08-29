package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.TransponderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransponderDetailRepository extends JpaRepository<TransponderDetail, Long> {
}
