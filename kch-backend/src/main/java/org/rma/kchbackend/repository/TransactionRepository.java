package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByVehicles_Id(Long vehicleId);
    Optional<Transaction> findByVehiclesId(Long vehicleId);
}
