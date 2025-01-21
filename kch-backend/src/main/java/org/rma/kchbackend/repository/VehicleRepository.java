package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByStatus(String status);
    List<Vehicle> findByKeycodeUserAndStatus(KeycodeUser keycodeUser, String status);
    List<Vehicle> findByKeycodeUser(KeycodeUser keycodeUser);
}