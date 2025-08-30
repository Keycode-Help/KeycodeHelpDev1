package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.TransponderFamily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransponderFamilyRepository extends JpaRepository<TransponderFamily, Long> {
    
    java.util.Optional<TransponderFamily> findByName(String name);
    
    @Query("SELECT tf FROM TransponderFamily tf WHERE LOWER(tf.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<TransponderFamily> findByNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);
}
