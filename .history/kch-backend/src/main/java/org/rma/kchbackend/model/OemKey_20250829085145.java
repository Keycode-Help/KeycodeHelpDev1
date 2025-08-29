package org.rma.kchbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "oem_key")
public class OemKey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100, unique = true)
    private String code;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Temporarily commented out to avoid Entry dependency
    // @ManyToMany(mappedBy = "oemKeys")
    // private List<Entry> entries;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
