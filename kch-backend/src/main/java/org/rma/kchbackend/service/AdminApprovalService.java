package org.rma.kchbackend.service;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Role;
import org.rma.kchbackend.repository.KeycodeUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminApprovalService {

    private final KeycodeUserRepository keycodeUserRepository;

    @Autowired
    public AdminApprovalService(KeycodeUserRepository keycodeUserRepository) {
        this.keycodeUserRepository = keycodeUserRepository;
    }

    /**
     * Get all pending admin approvals
     */
    public List<KeycodeUser> getPendingAdminApprovals() {
        return keycodeUserRepository.findByRoleAndIsAdminApproved(Role.ADMIN, false);
    }

    /**
     * Get all approved admin users
     */
    public List<KeycodeUser> getApprovedAdmins() {
        return keycodeUserRepository.findByRoleAndIsAdminApproved(Role.ADMIN, true);
    }

    /**
     * Approve an admin account
     */
    public boolean approveAdminAccount(Long adminId, String approvalNotes, String superAdminEmail) {
        Optional<KeycodeUser> adminUser = keycodeUserRepository.findById(adminId);
        
        if (adminUser.isPresent()) {
            KeycodeUser user = adminUser.get();
            
            // Verify the user is actually an admin
            if (user.getRole() != Role.ADMIN) {
                throw new IllegalArgumentException("User is not an admin");
            }
            
            // Approve the admin account
            user.setAdminApproved(true);
            user.setAdminApprovalNotes(approvalNotes);
            user.setActive(true);
            
            keycodeUserRepository.save(user);
            
            // Log the approval action (in production, this should go to a proper logging system)
            System.out.println("Admin account approved by: " + superAdminEmail + " for user: " + user.getEmail());
            
            return true;
        }
        
        return false;
    }

    /**
     * Reject an admin account
     */
    public boolean rejectAdminAccount(Long adminId, String rejectionNotes, String superAdminEmail) {
        Optional<KeycodeUser> adminUser = keycodeUserRepository.findById(adminId);
        
        if (adminUser.isPresent()) {
            KeycodeUser user = adminUser.get();
            
            // Verify the user is actually an admin
            if (user.getRole() != Role.ADMIN) {
                throw new IllegalArgumentException("User is not an admin");
            }
            
            // Reject the admin account and deactivate
            user.setAdminApproved(false);
            user.setAdminApprovalNotes(rejectionNotes);
            user.setActive(false);
            
            keycodeUserRepository.save(user);
            
            // Log the rejection action
            System.out.println("Admin account rejected by: " + superAdminEmail + " for user: " + user.getEmail());
            
            return true;
        }
        
        return false;
    }

    /**
     * Check if a user is a super admin
     */
    public boolean isSuperAdmin(String email) {
        KeycodeUser user = keycodeUserRepository.findByEmail(email);
        return user != null && user.getRole() == Role.SUPER_ADMIN;
    }

    /**
     * Check if a user is an approved admin
     */
    public boolean isApprovedAdmin(String email) {
        KeycodeUser user = keycodeUserRepository.findByEmail(email);
        return user != null && 
               user.getRole() == Role.ADMIN && 
               user.isAdminApproved() && 
               user.isActive();
    }

    /**
     * Get admin approval status for a user
     */
    public AdminApprovalStatus getAdminApprovalStatus(String email) {
        KeycodeUser user = keycodeUserRepository.findByEmail(email);
        
        if (user != null) {
            return new AdminApprovalStatus(
                user.getRole(),
                user.isAdminApproved(),
                user.isActive(),
                user.getAdminApprovalNotes()
            );
        }
        
        return null;
    }

    /**
     * Inner class to represent admin approval status
     */
    public static class AdminApprovalStatus {
        private final Role role;
        private final boolean isAdminApproved;
        private final boolean isActive;
        private final String approvalNotes;

        public AdminApprovalStatus(Role role, boolean isAdminApproved, boolean isActive, String approvalNotes) {
            this.role = role;
            this.isAdminApproved = isAdminApproved;
            this.isActive = isActive;
            this.approvalNotes = approvalNotes;
        }

        // Getters
        public Role getRole() { return role; }
        public boolean isAdminApproved() { return isAdminApproved; }
        public boolean isActive() { return isActive; }
        public String getApprovalNotes() { return approvalNotes; }
    }
}
