package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KeycodeUserRepository extends JpaRepository<KeycodeUser, Long> {
    KeycodeUser findByEmail(String email);
    List<KeycodeUser> findByRole(Role role);
    List<KeycodeUser> findByRoleAndIsActive(Role role, boolean isActive);
    List<KeycodeUser> findByRoleAndIsAdminApproved(Role role, boolean isAdminApproved);
    List<KeycodeUser> findByRoleAndIsValidatedUser(Role role, boolean isValidatedUser);
}
