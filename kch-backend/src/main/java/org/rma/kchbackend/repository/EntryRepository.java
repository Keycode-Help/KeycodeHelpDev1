package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.Entry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Long> {
    
    @Query("""
        SELECT e FROM Entry e 
        JOIN e.vehicleRange vr 
        JOIN vr.model m 
        JOIN m.make mk
        WHERE (:makeId IS NULL OR mk.id = :makeId)
        AND (:modelId IS NULL OR m.id = :modelId)
        AND (:yearFrom IS NULL OR vr.yearFrom <= :yearFrom)
        AND (:yearTo IS NULL OR (vr.yearTo IS NULL OR vr.yearTo >= :yearFrom))
        AND (:systemTypeId IS NULL OR e.systemType.id = :systemTypeId)
        AND (:transponderFamilyId IS NULL OR e.transponderFamily.id = :transponderFamilyId)
        """)
    Page<Entry> findByFilters(
        @Param("makeId") Long makeId,
        @Param("modelId") Long modelId,
        @Param("yearFrom") Integer yearFrom,
        @Param("yearTo") Integer yearTo,
        @Param("systemTypeId") Long systemTypeId,
        @Param("transponderFamilyId") Long transponderFamilyId,
        Pageable pageable
    );
    
    @Query("""
        SELECT e FROM Entry e 
        JOIN e.vehicleRange vr 
        JOIN vr.model m 
        JOIN m.make mk
        WHERE (:searchTerm IS NULL OR 
            LOWER(mk.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            LOWER(m.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            LOWER(e.transponderFamily.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            LOWER(e.transponderDetail.detail) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            EXISTS (SELECT 1 FROM e.crossRefs cr WHERE LOWER(cr.label) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) OR
            EXISTS (SELECT 1 FROM e.oemKeys ok WHERE LOWER(ok.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')))
        )
        """)
    Page<Entry> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("""
        SELECT e FROM Entry e 
        JOIN e.vehicleRange vr 
        JOIN vr.model m 
        JOIN m.make mk
        WHERE (:makeId IS NULL OR mk.id = :makeId)
        AND (:modelId IS NULL OR m.id = :modelId)
        AND (:yearFrom IS NULL OR vr.yearFrom <= :yearFrom)
        AND (:yearTo IS NULL OR (vr.yearTo IS NULL OR vr.yearTo >= :yearFrom))
        AND (:systemTypeId IS NULL OR e.systemType.id = :systemTypeId)
        AND (:transponderFamilyId IS NULL OR e.transponderFamily.id = :transponderFamilyId)
        AND (:searchTerm IS NULL OR 
            LOWER(mk.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            LOWER(m.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            LOWER(e.transponderFamily.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            LOWER(e.transponderDetail.detail) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            EXISTS (SELECT 1 FROM e.crossRefs cr WHERE LOWER(cr.label) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) OR
            EXISTS (SELECT 1 FROM e.oemKeys ok WHERE LOWER(ok.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')))
        )
        """)
    Page<Entry> findByFiltersAndSearch(
        @Param("makeId") Long makeId,
        @Param("modelId") Long modelId,
        @Param("yearFrom") Integer yearFrom,
        @Param("yearTo") Integer yearTo,
        @Param("systemTypeId") Long systemTypeId,
        @Param("transponderFamilyId") Long transponderFamilyId,
        @Param("searchTerm") String searchTerm,
        Pageable pageable
    );
}
