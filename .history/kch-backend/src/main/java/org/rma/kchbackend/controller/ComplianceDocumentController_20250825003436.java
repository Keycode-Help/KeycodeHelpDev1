package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.UserDocument;
import org.rma.kchbackend.model.UserLicense;
import org.rma.kchbackend.repository.UserDocumentRepository;
import org.rma.kchbackend.repository.UserLicenseRepository;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.compliance.ComplianceRequirement;
import org.rma.kchbackend.compliance.ComplianceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;

@RestController
@RequestMapping("/compliance")
public class ComplianceDocumentController {

    private final UserDocumentRepository docRepo;
    private final UserLicenseRepository licenseRepo;
    private final KeycodeUserService userService;
    private final ComplianceService complianceService;

    public ComplianceDocumentController(UserDocumentRepository docRepo,
                                        UserLicenseRepository licenseRepo,
                                        KeycodeUserService userService,
                                        ComplianceService complianceService) {
        this.docRepo = docRepo;
        this.licenseRepo = licenseRepo;
        this.userService = userService;
        this.complianceService = complianceService;
    }

    public record LicensePayload(String state, String licenseNumber, java.time.LocalDate expiresOn) {}
    public record DocumentPayload(String docType, String storageKey) {}
    public record ReviewPayload(boolean verified, String notes) {}

    @PostMapping("/license")
    public ResponseEntity<?> uploadLicense(@RequestHeader("X-User-Id") Long userId,
                                           @RequestBody LicensePayload payload) {
        var l = new UserLicense();
        l.setUserId(userId);
        l.setState(payload.state());
        l.setLicenseNumber(payload.licenseNumber());
        l.setExpiresOn(payload.expiresOn());
        l.setActive(false);
        licenseRepo.save(l);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/document")
    public ResponseEntity<?> uploadDocument(@RequestHeader("X-User-Id") Long userId,
                                            @RequestBody DocumentPayload payload) {
        var d = new UserDocument();
        d.setUserId(userId);
        d.setDocType(payload.docType());
        d.setStorageKey(payload.storageKey());
        d.setUploadedAt(OffsetDateTime.now());
        d.setVerified(false);
        docRepo.save(d);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/documents/{userId}")
    public ResponseEntity<?> listUserDocuments(@PathVariable Long userId) {
        return ResponseEntity.ok(docRepo.findAll().stream()
                .filter(d -> d.getUserId().equals(userId))
                .toList());
    }

    @PatchMapping("/documents/{docId}/review")
    public ResponseEntity<?> reviewDocument(@PathVariable Long docId,
                                            @RequestBody ReviewPayload payload,
                                            Authentication auth) {
        var doc = docRepo.findById(docId).orElse(null);
        if (doc == null) return ResponseEntity.notFound().build();
        doc.setVerified(payload.verified());
        doc.setReviewNotes(payload.notes());
        doc.setReviewedAt(OffsetDateTime.now());
        doc.setReviewedBy(auth != null ? auth.getName() : "unknown");
        docRepo.save(doc);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status")
    public ResponseEntity<?> complianceStatus(Authentication authentication) {
        String email = authentication.getName();
        KeycodeUser user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ComplianceRequirement cr = complianceService.evaluate(user.getId(), user.getState());
        return ResponseEntity.ok(
                java.util.Map.of(
                        "required", cr.required(),
                        "requiredDocs", cr.requiredDocs(),
                        "message", cr.userMessage(),
                        "jurisdiction", user.getState()
                )
        );
    }

    @GetMapping("/status/public")
    public ResponseEntity<?> publicComplianceStatus() {
        // Public endpoint for unauthenticated users
        return ResponseEntity.ok(
                java.util.Map.of(
                        "required", false,
                        "requiredDocs", java.util.List.of(),
                        "message", "Compliance requirements will be shown after login",
                        "jurisdiction", "N/A",
                        "authenticated", false
                )
        );
    }
}


