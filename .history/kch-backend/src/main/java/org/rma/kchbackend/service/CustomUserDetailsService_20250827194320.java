package org.rma.kchbackend.service;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.repository.KeycodeUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final KeycodeUserRepository keycodeUserRepository;

    @Autowired
    public CustomUserDetailsService(KeycodeUserRepository keycodeUserRepository) {
        this.keycodeUserRepository = keycodeUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("🔍 CustomUserDetailsService.loadUserByUsername() called with email: " + email);
        
        try {
            KeycodeUser keycodeUser = keycodeUserRepository.findByEmail(email);
            
            if (keycodeUser == null) {
                System.out.println("❌ User not found in database for email: " + email);
                throw new UsernameNotFoundException("User not found with email: " + email);
            }
            
            System.out.println("✅ User found in database:");
            System.out.println("  - ID: " + keycodeUser.getId());
            System.out.println("  - Email: " + keycodeUser.getEmail());
            System.out.println("  - Role: " + keycodeUser.getRole());
            System.out.println("  - Password Hash: " + keycodeUser.getPassword());
            System.out.println("  - Password Hash Length: " + (keycodeUser.getPassword() != null ? keycodeUser.getPassword().length() : "NULL"));
            System.out.println("  - Is Active: " + keycodeUser.isActive());
            System.out.println("  - Is Admin Approved: " + keycodeUser.isAdminApproved());
            
            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    keycodeUser.getEmail(),
                    keycodeUser.getPassword(),
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_" + keycodeUser.getRole().name()))
            );
            
            System.out.println("✅ UserDetails created successfully for: " + email);
            return userDetails;
            
        } catch (Exception e) {
            System.out.println("❌ Error in loadUserByUsername for email " + email + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
