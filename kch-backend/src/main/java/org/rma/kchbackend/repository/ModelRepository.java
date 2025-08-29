package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {
    
    List<Model> findByMakeId(Long makeId);
    
    @Query("SELECT m FROM Model m WHERE m.make.id = :makeId AND LOWER(m.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Model> findByMakeIdAndNameContainingIgnoreCase(@Param("makeId") Long makeId, @Param("searchTerm") String searchTerm);
    
    @Query("SELECT DISTINCT m.name FROM Model m WHERE m.make.id = :makeId ORDER BY m.name")
    List<String> findModelNamesByMakeId(@Param("makeId") Long makeId);
}
