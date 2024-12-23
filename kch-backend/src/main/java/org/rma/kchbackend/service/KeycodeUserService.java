package org.rma.kchbackend.service;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Role;
import org.rma.kchbackend.repository.KeycodeUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class KeycodeUserService {

    private final KeycodeUserRepository keycodeUserRepository;

    @Autowired
    public KeycodeUserService(KeycodeUserRepository keycodeUserRepository) {
        this.keycodeUserRepository = keycodeUserRepository;
    }

    public KeycodeUser saveUser(KeycodeUser keycodeUser) {
        return keycodeUserRepository.save(keycodeUser);
    }

    public Optional<KeycodeUser> getUserById(Long id) {
        return keycodeUserRepository.findById(id);
    }

    public Optional<KeycodeUser> findByEmail(String email) {
        return Optional.ofNullable(keycodeUserRepository.findByEmail(email));
    }

    public List<KeycodeUser> getAllAdminUsers() {
        return keycodeUserRepository.findByRole(Role.ADMIN);
    }

    public List<KeycodeUser> getAllUsers() {
        return keycodeUserRepository.findAll();
    }

    public Optional<KeycodeUser> findById(Long id) {
        return keycodeUserRepository.findById(id);
    }

    // Convert byte[] to Base64 string
    public String convertImageToBase64(byte[] image) {
        if (image == null) {
            return null;
        }
        return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(image);
    }
}