package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository extends JpaRepository<State , String> {
}
