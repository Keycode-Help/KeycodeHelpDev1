package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.TransponderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransponderDetailRepository extends JpaRepository<TransponderDetail, Long> {
    
    @Query("SELECT td FROM TransponderDetail td WHERE td.detail = :detail")
    java.util.Optional<TransponderDetail> findByDetail(@Param("detail") String detail);
}
