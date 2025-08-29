package org.rma.kchbackend.service;

import org.rma.kchbackend.model.*;
import org.rma.kchbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.logging.Logger;

@Service
@Transactional
public class TransponderDatabaseService {
    
    private static final Logger logger = Logger.getLogger(TransponderDatabaseService.class.getName());
    
    @Autowired
    private MakeRepository makeRepository;
    
    @Autowired
    private ModelRepository modelRepository;
    
    @Autowired
    private EntryRepository entryRepository;
    
    @Autowired
    private SystemTypeRepository systemTypeRepository;
    
    @Autowired
    private TransponderFamilyRepository transponderFamilyRepository;
    
    @Autowired
    private TransponderDetailRepository transponderDetailRepository;
    
    @Autowired
    private CrossRefRepository crossRefRepository;
    
    @Autowired
    private OemKeyRepository oemKeyRepository;
    
    @Autowired
    private NoteRepository noteRepository;
    
    @Autowired
    private EtlLogRepository etlLogRepository;
    
    /**
     * Search transponder entries with filters and search term
     */
    public Page<Entry> searchEntries(
            Long makeId, 
            Long modelId, 
            Integer yearFrom, 
            Integer yearTo,
            Long systemTypeId,
            Long transponderFamilyId,
            String searchTerm,
            int page,
            int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            return entryRepository.findByFiltersAndSearch(
                makeId, modelId, yearFrom, yearTo, 
                systemTypeId, transponderFamilyId, searchTerm, pageable
            );
        } else {
            return entryRepository.findByFilters(
                makeId, modelId, yearFrom, yearTo, 
                systemTypeId, transponderFamilyId, pageable
            );
        }
    }
    
    /**
     * Get entry by ID with all related data
     */
    public Optional<Entry> getEntryById(Long id) {
        return entryRepository.findById(id);
    }
    
    /**
     * Get all makes
     */
    public List<Make> getAllMakes() {
        return makeRepository.findAll();
    }
    
    /**
     * Get models by make ID
     */
    public List<Model> getModelsByMakeId(Long makeId) {
        return modelRepository.findByMakeId(makeId);
    }
    
    /**
     * Get models by make ID with search
     */
    public List<Model> getModelsByMakeIdAndSearch(Long makeId, String searchTerm) {
        return modelRepository.findByMakeIdAndNameContainingIgnoreCase(makeId, searchTerm);
    }
    
    /**
     * Get all system types
     */
    public List<SystemType> getAllSystemTypes() {
        return systemTypeRepository.findAll();
    }
    
    /**
     * Get all transponder families
     */
    public List<TransponderFamily> getAllTransponderFamilies() {
        return transponderFamilyRepository.findAll();
    }
    
    /**
     * Get years range for a specific model
     */
    public Map<String, Object> getYearRangeForModel(Long modelId) {
        // This would need a custom query to get min/max years for a model
        // For now, returning a placeholder
        Map<String, Object> result = new HashMap<>();
        result.put("minYear", 1990);
        result.put("maxYear", 2024);
        return result;
    }
    
    /**
     * Get search suggestions for autocomplete
     */
    public List<String> getSearchSuggestions(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        List<String> suggestions = new ArrayList<>();
        
        // Add transponder family suggestions
        transponderFamilyRepository.findByNameContainingIgnoreCase(query.trim())
            .stream()
            .limit(limit / 3)
            .forEach(tf -> suggestions.add(tf.getName()));
        
        // Add OEM key suggestions
        oemKeyRepository.findByCodeContainingIgnoreCase(query.trim())
            .stream()
            .limit(limit / 3)
            .forEach(ok -> suggestions.add(ok.getCode()));
        
        // Add cross-ref suggestions
        crossRefRepository.findByLabelContainingIgnoreCase(query.trim())
            .stream()
            .limit(limit / 3)
            .forEach(cr -> suggestions.add(cr.getLabel()));
        
        return suggestions.stream().distinct().limit(limit).toList();
    }
    
    /**
     * Get database statistics
     */
    public Map<String, Object> getDatabaseStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMakes", makeRepository.count());
        stats.put("totalModels", modelRepository.count());
        stats.put("totalEntries", entryRepository.count());
        stats.put("totalSystemTypes", systemTypeRepository.count());
        stats.put("totalTransponderFamilies", transponderFamilyRepository.count());
        stats.put("totalOemKeys", oemKeyRepository.count());
        stats.put("totalCrossRefs", crossRefRepository.count());
        stats.put("totalNotes", noteRepository.count());
        return stats;
    }
}
