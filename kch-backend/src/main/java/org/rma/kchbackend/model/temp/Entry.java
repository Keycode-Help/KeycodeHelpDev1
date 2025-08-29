package org.rma.kchbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "entry")
public class Entry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_range_id", nullable = false)
    private VehicleRange vehicleRange;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "system_type_id")
    private SystemType systemType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transponder_family_id")
    private TransponderFamily transponderFamily;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transponder_detail_id")
    private TransponderDetail transponderDetail;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "entry_cross_ref",
        joinColumns = @JoinColumn(name = "entry_id"),
        inverseJoinColumns = @JoinColumn(name = "cross_ref_id")
    )
    private List<CrossRef> crossRefs;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "entry_oem_key",
        joinColumns = @JoinColumn(name = "entry_id"),
        inverseJoinColumns = @JoinColumn(name = "oem_key_id")
    )
    private List<OemKey> oemKeys;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "entry_note",
        joinColumns = @JoinColumn(name = "entry_id"),
        inverseJoinColumns = @JoinColumn(name = "note_id")
    )
    private List<Note> notes;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
