package org.rma.kchbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "cross_ref")
public class CrossRef {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200, unique = true)
    private String label;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Temporarily commented out to avoid Entry dependency
    // @ManyToMany(mappedBy = "crossRefs")
    // private List<Entry> entries;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
