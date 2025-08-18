package org.rma.kchbackend.compliance;

import org.rma.kchbackend.repository.UserDocumentRepository;
import org.rma.kchbackend.repository.UserLicenseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ComplianceService {

    public static final String DOC_STATE_LOCKSMITH_LICENSE = "STATE_LOCKSMITH_LICENSE";
    public static final String DOC_PHOTO_ID = "PHOTO_ID";
    public static final String DOC_BUSINESS_REG = "BUSINESS_REG";
    public static final String DOC_INSURANCE = "INSURANCE";

    private final LicensedStates licensedStates;
    private final UserLicenseRepository licenseRepo;
    private final UserDocumentRepository docRepo;

    public ComplianceService(LicensedStates licensedStates,
                             UserLicenseRepository licenseRepo,
                             UserDocumentRepository docRepo) {
        this.licensedStates = licensedStates;
        this.licenseRepo = licenseRepo;
        this.docRepo = docRepo;
    }

    public ComplianceRequirement evaluate(Long userId, String userState) {
        if (!licensedStates.requiresLicense(userState)) {
            return new ComplianceRequirement(false, List.of(), "");
        }

        List<String> missing = new ArrayList<>();

        var hasValidLicense = licenseRepo
                .findFirstByUserIdAndStateAndActiveTrue(userId, userState)
                .filter(l -> l.getExpiresOn() == null || !l.getExpiresOn().isBefore(LocalDate.now()))
                .isPresent();

        if (!hasValidLicense) {
            missing.add(DOC_STATE_LOCKSMITH_LICENSE);
        }

        var hasPhotoId = docRepo.existsByUserIdAndDocTypeAndVerifiedTrue(userId, DOC_PHOTO_ID);
        if (!hasPhotoId) {
            missing.add(DOC_PHOTO_ID);
        }

        var message = buildUserMessage(userState, missing,
                docRepo.existsByUserIdAndDocTypeAndVerifiedTrue(userId, DOC_BUSINESS_REG),
                docRepo.existsByUserIdAndDocTypeAndVerifiedTrue(userId, DOC_INSURANCE));

        return new ComplianceRequirement(!missing.isEmpty(), missing, message);
    }

    private String buildUserMessage(String state, List<String> missing, boolean hasBizReg, boolean hasIns) {
        var sb = new StringBuilder();
        sb.append("Additional verification required for ").append(state).append(".\n\n")
          .append("To process keycode requests in ").append(state)
          .append(", state law requires verification of locksmith credentials.\n");

        if (!missing.isEmpty()) {
            sb.append("\nPlease submit the following before your request can proceed:\n");
            for (String m : missing) {
                if (DOC_STATE_LOCKSMITH_LICENSE.equals(m)) {
                    sb.append("• A valid ").append(state).append(" locksmith license (license number and expiration).\n");
                } else if (DOC_PHOTO_ID.equals(m)) {
                    sb.append("• Government-issued photo ID (name must match your account or company record).\n");
                }
            }
            sb.append("\nOptional (recommended for faster future approvals):\n");
            if (!hasBizReg) sb.append("• Business registration (city/county/state)\n");
            if (!hasIns) sb.append("• Proof of current business liability insurance\n");
        }

        sb.append("\nOnce uploaded, our team will verify and notify you. Thank you for helping us stay compliant.");
        return sb.toString();
    }
}


