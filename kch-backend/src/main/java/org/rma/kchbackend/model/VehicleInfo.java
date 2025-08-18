package org.rma.kchbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "vehicle_info")
public class VehicleInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 17)
    private String vin;
    
    @Column(name = "year")
    private Integer year;
    
    @Column(name = "make", length = 64)
    private String make;
    
    @Column(name = "model", length = 64)
    private String model;
    
    @Column(name = "trim", length = 64)
    private String trim;
    
    @Column(name = "engine", length = 64)
    private String engine;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
