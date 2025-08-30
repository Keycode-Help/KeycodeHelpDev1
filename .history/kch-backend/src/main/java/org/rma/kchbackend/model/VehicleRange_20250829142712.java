package org.rma.kchbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "vehicle_range")
public class VehicleRange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    private Model model;
    
    @Column(name = "year_from", nullable = false)
    private Integer yearFrom;
    
    @Column(name = "year_to")
    private Integer yearTo;
    
    @Column(name = "year_note", length = 50)
    private String yearNote;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "vehicleRange", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<Entry> entries;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
