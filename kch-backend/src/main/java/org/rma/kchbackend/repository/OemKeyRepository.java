package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.OemKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OemKeyRepository extends JpaRepository<OemKey, Long> {
    
    @Query("SELECT ok FROM OemKey ok WHERE LOWER(ok.code) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<OemKey> findByCodeContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT ok FROM OemKey ok WHERE ok.code = :code")
    java.util.Optional<OemKey> findByCode(@Param("code") String code);
}
