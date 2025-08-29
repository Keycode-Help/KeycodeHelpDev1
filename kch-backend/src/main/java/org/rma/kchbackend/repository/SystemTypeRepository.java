package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.SystemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemTypeRepository extends JpaRepository<SystemType, Long> {
    
    java.util.Optional<SystemType> findByName(String name);
}
