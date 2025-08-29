package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.CrossRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CrossRefRepository extends JpaRepository<CrossRef, Long> {
    
    @Query("SELECT cr FROM CrossRef cr WHERE LOWER(cr.label) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<CrossRef> findByLabelContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT cr FROM CrossRef cr WHERE cr.label = :label")
    java.util.Optional<CrossRef> findByLabel(@Param("label") String label);
}
