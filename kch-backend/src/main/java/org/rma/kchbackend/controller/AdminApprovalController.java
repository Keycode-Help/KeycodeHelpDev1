package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.service.AdminApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:51731", "http://localhost:51732", "http://localhost:51733", "http://localhost:51734"})
@RestController
@RequestMapping("/admin-approval")
public class AdminApprovalController {

    private final AdminApprovalService adminApprovalService;

    @Autowired
    public AdminApprovalController(AdminApprovalService adminApprovalService) {
        this.adminApprovalService = adminApprovalService;
    }

    /**
     * Get all pending admin approvals (Super Admin only)
     */
    @GetMapping("/pending")
    public ResponseEntity<List<KeycodeUser>> getPendingAdminApprovals(@RequestParam String superAdminEmail) {
        try {
            // Verify the requesting user is a super admin
            if (!adminApprovalService.isSuperAdmin(superAdminEmail)) {
                return ResponseEntity.status(403).body(null);
            }

            List<KeycodeUser> pendingAdmins = adminApprovalService.getPendingAdminApprovals();
            return ResponseEntity.ok(pendingAdmins);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Get all approved admin users (Super Admin only)
     */
    @GetMapping("/approved")
    public ResponseEntity<List<KeycodeUser>> getApprovedAdmins(@RequestParam String superAdminEmail) {
        try {
            // Verify the requesting user is a super admin
            if (!adminApprovalService.isSuperAdmin(superAdminEmail)) {
                return ResponseEntity.status(403).body(null);
            }

            List<KeycodeUser> approvedAdmins = adminApprovalService.getApprovedAdmins();
            return ResponseEntity.ok(approvedAdmins);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Approve an admin account (Super Admin only)
     */
    @PostMapping("/approve")
    public ResponseEntity<Map<String, Object>> approveAdminAccount(@RequestBody Map<String, Object> request) {
        try {
            String superAdminEmail = (String) request.get("superAdminEmail");
            Long adminId = Long.valueOf((String) request.get("adminId"));
            String approvalNotes = (String) request.get("approvalNotes");

            // Verify the requesting user is a super admin
            if (!adminApprovalService.isSuperAdmin(superAdminEmail)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. Super admin privileges required."));
            }

            boolean success = adminApprovalService.approveAdminAccount(adminId, approvalNotes, superAdminEmail);
            
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Admin account approved successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Failed to approve admin account"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * Reject an admin account (Super Admin only)
     */
    @PostMapping("/reject")
    public ResponseEntity<Map<String, Object>> rejectAdminAccount(@RequestBody Map<String, Object> request) {
        try {
            String superAdminEmail = (String) request.get("superAdminEmail");
            Long adminId = Long.valueOf((String) request.get("adminId"));
            String rejectionNotes = (String) request.get("rejectionNotes");

            // Verify the requesting user is a super admin
            if (!adminApprovalService.isSuperAdmin(superAdminEmail)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. Super admin privileges required."));
            }

            boolean success = adminApprovalService.rejectAdminAccount(adminId, rejectionNotes, superAdminEmail);
            
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Admin account rejected successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject admin account"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * Get admin approval status for a user
     */
    @GetMapping("/status/{email}")
    public ResponseEntity<AdminApprovalService.AdminApprovalStatus> getAdminApprovalStatus(@PathVariable String email) {
        try {
            AdminApprovalService.AdminApprovalStatus status = adminApprovalService.getAdminApprovalStatus(email);
            if (status != null) {
                return ResponseEntity.ok(status);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Check if current user is a super admin
     */
    @GetMapping("/is-super-admin")
    public ResponseEntity<Map<String, Boolean>> isSuperAdmin(@RequestParam String email) {
        try {
            boolean isSuperAdmin = adminApprovalService.isSuperAdmin(email);
            return ResponseEntity.ok(Map.of("isSuperAdmin", isSuperAdmin));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("isSuperAdmin", false));
        }
    }
}
