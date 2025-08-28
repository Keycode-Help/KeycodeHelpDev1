package org.rma.kchbackend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.rma.kchbackend.model.AdminRegistrationCode;
import org.rma.kchbackend.repository.AdminRegistrationCodeRepository;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminRegistrationCodeServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private AdminRegistrationCodeRepository adminRegistrationCodeRepository;

    private AdminRegistrationCodeService adminRegistrationCodeService;

    @BeforeEach
    void setUp() {
        adminRegistrationCodeService = new AdminRegistrationCodeService(mailSender, adminRegistrationCodeRepository);
    }

    @Test
    void testGenerateAdminRegistrationCode() {
        // Given
        String email = "test@example.com";
        String applicantName = "Test User";
        
        when(adminRegistrationCodeRepository.findActiveCodeByEmailAndCode(any(), any(), any()))
            .thenReturn(Optional.empty());
        when(adminRegistrationCodeRepository.save(any())).thenReturn(new AdminRegistrationCode());

        // When
        String code = adminRegistrationCodeService.generateAdminRegistrationCode(email, applicantName);

        // Then
        assertNotNull(code);
        assertEquals(8, code.length());
        assertTrue(code.matches("[A-Z0-9]{8}"));
        
        verify(adminRegistrationCodeRepository).save(any(AdminRegistrationCode.class));
    }

    @Test
    void testValidateAdminRegistrationCode_ValidCode() {
        // Given
        String email = "test@example.com";
        String code = "ABC12345";
        
        AdminRegistrationCode codeEntity = new AdminRegistrationCode();
        codeEntity.setCode(code);
        codeEntity.setEmail(email);
        codeEntity.setExpiryTime(LocalDateTime.now().plusHours(1));
        codeEntity.setIsUsed(false);
        
        when(adminRegistrationCodeRepository.findActiveCodeByEmailAndCode(email, code, any()))
            .thenReturn(Optional.of(codeEntity));
        when(adminRegistrationCodeRepository.save(any())).thenReturn(codeEntity);

        // When
        boolean isValid = adminRegistrationCodeService.validateAdminRegistrationCode(email, code);

        // Then
        assertTrue(isValid);
        verify(adminRegistrationCodeRepository).save(any(AdminRegistrationCode.class));
    }

    @Test
    void testValidateAdminRegistrationCode_ExpiredCode() {
        // Given
        String email = "test@example.com";
        String code = "ABC12345";
        
        AdminRegistrationCode codeEntity = new AdminRegistrationCode();
        codeEntity.setCode(code);
        codeEntity.setEmail(email);
        codeEntity.setExpiryTime(LocalDateTime.now().minusHours(1)); // Expired
        codeEntity.setIsUsed(false);
        
        when(adminRegistrationCodeRepository.findActiveCodeByEmailAndCode(email, code, any()))
            .thenReturn(Optional.empty());

        // When
        boolean isValid = adminRegistrationCodeService.validateAdminRegistrationCode(email, code);

        // Then
        assertFalse(isValid);
        verify(adminRegistrationCodeRepository, never()).save(any());
    }

    @Test
    void testValidateAdminRegistrationCode_UsedCode() {
        // Given
        String email = "test@example.com";
        String code = "ABC12345";
        
        AdminRegistrationCode codeEntity = new AdminRegistrationCode();
        codeEntity.setCode(code);
        codeEntity.setEmail(email);
        codeEntity.setExpiryTime(LocalDateTime.now().plusHours(1));
        codeEntity.setIsUsed(true); // Already used
        
        when(adminRegistrationCodeRepository.findActiveCodeByEmailAndCode(email, code, any()))
            .thenReturn(Optional.empty());

        // When
        boolean isValid = adminRegistrationCodeService.validateAdminRegistrationCode(email, code);

        // Then
        assertFalse(isValid);
        verify(adminRegistrationCodeRepository, never()).save(any());
    }

    @Test
    void testValidateAdminRegistrationCode_InvalidCode() {
        // Given
        String email = "test@example.com";
        String code = "INVALID";
        
        when(adminRegistrationCodeRepository.findActiveCodeByEmailAndCode(email, code, any()))
            .thenReturn(Optional.empty());

        // When
        boolean isValid = adminRegistrationCodeService.validateAdminRegistrationCode(email, code);

        // Then
        assertFalse(isValid);
        verify(adminRegistrationCodeRepository, never()).save(any());
    }
}
