package org.rma.kchbackend.compliance;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.rma.kchbackend.repository.UserDocumentRepository;
import org.rma.kchbackend.repository.UserLicenseRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

public class ComplianceServiceTest {

    private LicensedStates licensedStates = new LicensedStates("");
    private UserLicenseRepository licenseRepo = Mockito.mock(UserLicenseRepository.class);
    private UserDocumentRepository docRepo = Mockito.mock(UserDocumentRepository.class);
    private ComplianceService svc = new ComplianceService(licensedStates, licenseRepo, docRepo);

    @Test
    void nonLicensedState_notRequired() {
        ComplianceRequirement cr = svc.evaluate(1L, "Wyoming");
        assertFalse(cr.required());
    }

    @Test
    void licensed_missingBoth_required() {
        Mockito.when(licenseRepo.findFirstByUserIdAndStateAndActiveTrue(anyLong(), anyString()))
                .thenReturn(Optional.empty());
        Mockito.when(docRepo.existsByUserIdAndDocTypeAndVerifiedTrue(anyLong(), anyString()))
                .thenReturn(false);

        ComplianceRequirement cr = svc.evaluate(1L, "Texas");
        assertTrue(cr.required());
        assertTrue(cr.requiredDocs().contains(ComplianceService.DOC_STATE_LOCKSMITH_LICENSE));
        assertTrue(cr.requiredDocs().contains(ComplianceService.DOC_PHOTO_ID));
        assertTrue(cr.userMessage().contains("Texas"));
    }
}


