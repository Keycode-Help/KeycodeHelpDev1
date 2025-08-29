package org.rma.kchbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "system_type")
public class SystemType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200, unique = true)
    private String name;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Temporarily commented out to avoid Entry dependency
    // @OneToMany(mappedBy = "systemType", fetch = FetchType.LAZY)
    // private List<Entry> entries;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
