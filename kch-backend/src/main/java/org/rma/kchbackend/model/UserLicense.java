package org.rma.kchbackend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_licenses")
public class UserLicense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String licenseNumber;

    private LocalDate expiresOn;

    @Column(nullable = false)
    private boolean active = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public LocalDate getExpiresOn() { return expiresOn; }
    public void setExpiresOn(LocalDate expiresOn) { this.expiresOn = expiresOn; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}


