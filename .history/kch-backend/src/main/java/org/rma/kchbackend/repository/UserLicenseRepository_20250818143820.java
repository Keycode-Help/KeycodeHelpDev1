package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.UserLicense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserLicenseRepository extends JpaRepository<UserLicense, Long> {
    Optional<UserLicense> findFirstByUserIdAndStateAndActiveTrue(Long userId, String state);
}


