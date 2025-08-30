package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.Entry;
import org.rma.kchbackend.model.Make;
import org.rma.kchbackend.model.Model;
import org.rma.kchbackend.model.SystemType;
import org.rma.kchbackend.model.TransponderFamily;
import org.rma.kchbackend.model.EtlLog;
import org.rma.kchbackend.service.TransponderDatabaseService;
import org.rma.kchbackend.service.TransponderEtlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/kch")
@CrossOrigin(origins = "*")
public class TransponderDatabaseController {
    
    private static final Logger logger = Logger.getLogger(TransponderDatabaseController.class.getName());
    
    @Autowired
    private TransponderDatabaseService transponderDatabaseService;
    
    @Autowired
    private TransponderEtlService transponderEtlService;
    
    /**
     * Search transponder entries
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchEntries(
            @RequestParam(required = false) Long makeId,
            @RequestParam(required = false) Long modelId,
            @RequestParam(required = false) Integer yearFrom,
            @RequestParam(required = false) Integer yearTo,
            @RequestParam(required = false) Long systemTypeId,
            @RequestParam(required = false) Long transponderFamilyId,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        
        try {
            logger.info("🔍 Transponder search request - Make: " + makeId + 
                       ", Model: " + modelId + ", Year: " + yearFrom + "-" + yearTo + 
                       ", Search: " + q + ", Page: " + page);
            
            Page<Entry> results = transponderDatabaseService.searchEntries(
                makeId, modelId, yearFrom, yearTo, 
                systemTypeId, transponderFamilyId, q, page, pageSize
            );
            
            Map<String, Object> response = Map.of(
                "content", results.getContent(),
                "totalElements", results.getTotalElements(),
                "totalPages", results.getTotalPages(),
                "currentPage", results.getNumber(),
                "pageSize", results.getSize(),
                "hasNext", results.hasNext(),
                "hasPrevious", results.hasPrevious()
            );
            
            logger.info("✅ Search completed - Found " + results.getTotalElements() + " results");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.severe("❌ Error during transponder search: " + e.getMessage());
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to search transponder database"));
        }
    }
    
    /**
     * Get entry by ID
     */
    @GetMapping("/entry/{id}")
    public ResponseEntity<Map<String, Object>> getEntryById(@PathVariable Long id) {
        try {
            logger.info("🔍 Getting transponder entry ID: " + id);
            
            var entry = transponderDatabaseService.getEntryById(id);
            if (entry.isPresent()) {
                logger.info("✅ Entry found: " + id);
                return ResponseEntity.ok(Map.of("entry", entry.get()));
            } else {
                logger.warning("⚠️ Entry not found: " + id);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.severe("❌ Error getting entry " + id + ": " + e.getMessage());
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to retrieve entry"));
        }
    }
    
    /**
     * Get all makes
     */
    @GetMapping("/makes")
    public ResponseEntity<List<Make>> getAllMakes() {
        try {
            List<Make> makes = transponderDatabaseService.getAllMakes();
            return ResponseEntity.ok(makes);
        } catch (Exception e) {
            logger.severe("❌ Error getting makes: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get models by make ID
     */
    @GetMapping("/makes/{makeId}/models")
    public ResponseEntity<List<Model>> getModelsByMakeId(
            @PathVariable Long makeId,
            @RequestParam(required = false) String search) {
        try {
            List<Model> models;
            if (search != null && !search.trim().isEmpty()) {
                models = transponderDatabaseService.getModelsByMakeIdAndSearch(makeId, search);
            } else {
                models = transponderDatabaseService.getModelsByMakeId(makeId);
            }
            return ResponseEntity.ok(models);
        } catch (Exception e) {
            logger.severe("❌ Error getting models for make " + makeId + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get all system types
     */
    @GetMapping("/system-types")
    public ResponseEntity<List<SystemType>> getAllSystemTypes() {
        try {
            List<SystemType> systemTypes = transponderDatabaseService.getAllSystemTypes();
            return ResponseEntity.ok(systemTypes);
        } catch (Exception e) {
            logger.severe("❌ Error getting system types: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get all transponder families
     */
    @GetMapping("/transponder-families")
    public ResponseEntity<List<TransponderFamily>> getAllTransponderFamilies() {
        try {
            List<TransponderFamily> families = transponderDatabaseService.getAllTransponderFamilies();
            return ResponseEntity.ok(families);
        } catch (Exception e) {
            logger.severe("❌ Error getting transponder families: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get search suggestions for autocomplete
     */
    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSearchSuggestions(
            @RequestParam String q,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<String> suggestions = transponderDatabaseService.getSearchSuggestions(q, limit);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            logger.severe("❌ Error getting search suggestions: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get database statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDatabaseStats() {
        try {
            Map<String, Object> stats = transponderDatabaseService.getDatabaseStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.severe("❌ Error getting database stats: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Run ETL process (Admin only)
     */
    @PostMapping("/etl/run")
    public ResponseEntity<Map<String, Object>> runEtl(Authentication authentication) {
        try {
            // Check if user is admin
            if (authentication == null || 
                !authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN") || 
                                    auth.getAuthority().equals("ROLE_SUPER_ADMIN"))) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "Access denied. Admin privileges required."));
            }
            
            logger.info("🚀 Admin ETL request from user: " + authentication.getName());
            
            EtlLog etlLog = transponderEtlService.runEtl();
            
            Map<String, Object> response = Map.of(
                "message", "ETL process started successfully",
                "etlLogId", etlLog.getId(),
                "status", etlLog.getStatus(),
                "startedAt", etlLog.getStartedAt()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.severe("❌ Error starting ETL process: " + e.getMessage());
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to start ETL process"));
        }
    }
    
    /**
     * Get ETL logs (Admin only)
     */
    @GetMapping("/etl/logs")
    public ResponseEntity<List<EtlLog>> getEtlLogs(Authentication authentication) {
        try {
            // Check if user is admin
            if (authentication == null || 
                !authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN") || 
                                    auth.getAuthority().equals("ROLE_SUPER_ADMIN"))) {
                return ResponseEntity.status(403).build();
            }
            
            List<EtlLog> logs = transponderEtlService.getEtlLogs();
            return ResponseEntity.ok(logs);
            
        } catch (Exception e) {
            logger.severe("❌ Error getting ETL logs: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
