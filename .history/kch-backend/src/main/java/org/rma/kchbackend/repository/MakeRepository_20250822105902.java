package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.Make;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MakeRepository extends JpaRepository<Make, Long> {
    Make findByName(String name);
}
