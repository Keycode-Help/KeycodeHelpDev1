package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.UserDocument;
import org.rma.kchbackend.model.UserLicense;
import org.rma.kchbackend.repository.UserDocumentRepository;
import org.rma.kchbackend.repository.UserLicenseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;

@RestController
@RequestMapping("/compliance")
public class ComplianceDocumentController {

    private final UserDocumentRepository docRepo;
    private final UserLicenseRepository licenseRepo;

    public ComplianceDocumentController(UserDocumentRepository docRepo, UserLicenseRepository licenseRepo) {
        this.docRepo = docRepo;
        this.licenseRepo = licenseRepo;
    }

    public record LicensePayload(String state, String licenseNumber, java.time.LocalDate expiresOn) {}
    public record DocumentPayload(String docType, String storageKey) {}

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
}


