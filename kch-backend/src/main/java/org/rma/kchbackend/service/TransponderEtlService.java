package org.rma.kchbackend.service;

import org.rma.kchbackend.model.*;
import org.rma.kchbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StringUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.*;
import java.util.logging.Logger;
import java.util.regex.Pattern;

@Service
@Transactional
public class TransponderEtlService {
    
    private static final Logger logger = Logger.getLogger(TransponderEtlService.class.getName());
    
    @Autowired
    private MakeRepository makeRepository;
    
    @Autowired
    private ModelRepository modelRepository;
    
    @Autowired
    private VehicleRangeRepository vehicleRangeRepository;
    
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
    private EntryRepository entryRepository;
    
    @Autowired
    private EtlLogRepository etlLogRepository;
    
    private static final Pattern TABLE_PATTERN = Pattern.compile("\\|.*\\|");
    private static final Pattern DATA_PATTERN = Pattern.compile("\\|\\s*([^|]*?)\\s*\\|");
    
    /**
     * Run the ETL process to ingest transponder data
     */
    public EtlLog runEtl() {
        EtlLog etlLog = new EtlLog();
        etlLog.setVersion("1.0.0");
        etlLog.setStartedAt(LocalDateTime.now());
        etlLog.setStatus("running");
        etlLogRepository.save(etlLog);
        
        try {
            logger.info("🚀 Starting Transponder ETL process...");
            
            // Read and parse the markdown file
            List<Map<String, String>> rawData = parseTransponderData();
            logger.info("📊 Parsed " + rawData.size() + " raw data rows");
            
            // Process and ingest the data
            int processedCount = processTransponderData(rawData);
            
            // Update ETL log
            etlLog.setCompletedAt(LocalDateTime.now());
            etlLog.setRecordsProcessed(processedCount);
            etlLog.setStatus("completed");
            etlLogRepository.save(etlLog);
            
            logger.info("✅ ETL process completed successfully. Processed " + processedCount + " records.");
            
        } catch (Exception e) {
            logger.severe("❌ ETL process failed: " + e.getMessage());
            etlLog.setCompletedAt(LocalDateTime.now());
            etlLog.setStatus("failed");
            etlLog.setErrorMessage(e.getMessage());
            etlLogRepository.save(etlLog);
        }
        
        return etlLog;
    }
    
    /**
     * Parse the Transponder data markdown file
     */
    private List<Map<String, String>> parseTransponderData() throws IOException {
        List<Map<String, String>> data = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource("Transponder data.md").getInputStream()))) {
            
            String line;
            boolean inTable = false;
            List<String> headers = new ArrayList<>();
            
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                
                if (line.startsWith("|") && line.endsWith("|")) {
                    if (!inTable) {
                        inTable = true;
                        headers = parseHeaders(line);
                    } else if (headers.size() > 0) {
                        // Skip separator lines (e.g., | ----- | ----- |)
                        if (!line.matches("\\|\\s*-+\\s*\\|.*")) {
                            Map<String, String> row = parseDataRow(line, headers);
                            if (isValidDataRow(row)) {
                                data.add(row);
                            }
                        }
                    }
                } else if (inTable && !line.startsWith("|")) {
                    inTable = false;
                }
            }
        }
        
        return data;
    }
    
    /**
     * Parse table headers from a markdown table row
     */
    private List<String> parseHeaders(String headerLine) {
        List<String> headers = new ArrayList<>();
        String[] parts = headerLine.split("\\|");
        
        for (String part : parts) {
            String header = part.trim();
            if (!header.isEmpty()) {
                headers.add(header);
            }
        }
        
        return headers;
    }
    
    /**
     * Parse a data row from the markdown table
     */
    private Map<String, String> parseDataRow(String dataLine, List<String> headers) {
        Map<String, String> row = new HashMap<>();
        String[] parts = dataLine.split("\\|");
        
        for (int i = 0; i < Math.min(headers.size(), parts.length); i++) {
            String value = parts[i].trim();
            if (!value.isEmpty()) {
                row.put(headers.get(i), value);
            }
        }
        
        return row;
    }
    
    /**
     * Check if a data row contains valid information
     */
    private boolean isValidDataRow(Map<String, String> row) {
        return row.containsKey("Make") && 
               row.containsKey("Model") && 
               !row.get("Make").trim().isEmpty() && 
               !row.get("Model").trim().isEmpty();
    }
    
    /**
     * Process and ingest the parsed transponder data
     */
    private int processTransponderData(List<Map<String, String>> rawData) {
        int processedCount = 0;
        
        for (Map<String, String> row : rawData) {
            try {
                processTransponderRow(row);
                processedCount++;
            } catch (Exception e) {
                logger.warning("⚠️ Failed to process row: " + row + " - Error: " + e.getMessage());
            }
        }
        
        return processedCount;
    }
    
    /**
     * Process a single transponder data row
     */
    private void processTransponderRow(Map<String, String> row) {
        // Get or create Make
        String makeName = row.get("Make").trim();
        Make make = getOrCreateMake(makeName);
        
        // Get or create Model
        String modelName = row.get("Model").trim();
        Model model = getOrCreateModel(make, modelName);
        
        // Get or create VehicleRange
        VehicleRange vehicleRange = getOrCreateVehicleRange(model, row);
        
        // Get or create SystemType
        SystemType systemType = null;
        if (row.containsKey("System Type") && StringUtils.hasText(row.get("System Type"))) {
            systemType = getOrCreateSystemType(row.get("System Type").trim());
        }
        
        // Get or create TransponderFamily
        TransponderFamily transponderFamily = null;
        if (row.containsKey("Transponder Family") && StringUtils.hasText(row.get("Transponder Family"))) {
            transponderFamily = getOrCreateTransponderFamily(row.get("Transponder Family").trim());
        }
        
        // Get or create TransponderDetail
        TransponderDetail transponderDetail = null;
        if (row.containsKey("Transponder Detail") && StringUtils.hasText(row.get("Transponder Detail"))) {
            transponderDetail = getOrCreateTransponderDetail(row.get("Transponder Detail").trim());
        }
        
        // Create Entry
        Entry entry = new Entry();
        entry.setVehicleRange(vehicleRange);
        entry.setSystemType(systemType);
        entry.setTransponderFamily(transponderFamily);
        entry.setTransponderDetail(transponderDetail);
        
        // Process Cross References
        if (row.containsKey("Cross-Refs") && StringUtils.hasText(row.get("Cross-Refs"))) {
            List<CrossRef> crossRefs = processCrossRefs(row.get("Cross-Refs").trim());
            entry.setCrossRefs(crossRefs);
        }
        
        // Process OEM Keys
        if (row.containsKey("OEM Keys") && StringUtils.hasText(row.get("OEM Keys"))) {
            List<OemKey> oemKeys = processOemKeys(row.get("OEM Keys").trim());
            entry.setOemKeys(oemKeys);
        }
        
        // Process Notes
        if (row.containsKey("Notes") && StringUtils.hasText(row.get("Notes"))) {
            List<Note> notes = processNotes(row.get("Notes").trim());
            entry.setNotes(notes);
        }
        
        // Save the entry
        entryRepository.save(entry);
    }
    
    /**
     * Get or create a Make entity
     */
    private Make getOrCreateMake(String makeName) {
        return makeRepository.findByName(makeName)
            .orElseGet(() -> {
                Make make = new Make();
                make.setName(makeName);
                return makeRepository.save(make);
            });
    }
    
    /**
     * Get or create a Model entity
     */
    private Model getOrCreateModel(Make make, String modelName) {
        return modelRepository.findByMakeIdAndNameContainingIgnoreCase(make.getId(), modelName)
            .stream()
            .findFirst()
            .orElseGet(() -> {
                Model model = new Model();
                model.setMake(make);
                model.setName(modelName);
                return modelRepository.save(model);
            });
    }
    
    /**
     * Get or create a VehicleRange entity
     */
    private VehicleRange getOrCreateVehicleRange(Model model, Map<String, String> row) {
        Integer yearFrom = parseYear(row.get("Year From"));
        Integer yearTo = parseYear(row.get("Year To"));
        String yearNote = row.get("Year Note");
        
        // Check if this range already exists
        List<VehicleRange> existingRanges = vehicleRangeRepository.findByModelIdAndYearFromAndYearTo(
            model.getId(), yearFrom, yearTo);
        
        if (!existingRanges.isEmpty()) {
            return existingRanges.get(0);
        }
        
        VehicleRange vehicleRange = new VehicleRange();
        vehicleRange.setModel(model);
        vehicleRange.setYearFrom(yearFrom);
        vehicleRange.setYearTo(yearTo);
        vehicleRange.setYearNote(yearNote);
        
        return vehicleRangeRepository.save(vehicleRange);
    }
    
    /**
     * Parse year value from string
     */
    private Integer parseYear(String yearStr) {
        if (yearStr == null || yearStr.trim().isEmpty()) {
            return null;
        }
        
        String cleanYear = yearStr.trim().replaceAll("[^0-9]", "");
        if (cleanYear.isEmpty()) {
            return null;
        }
        
        try {
            return Integer.parseInt(cleanYear);
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    /**
     * Get or create a SystemType entity
     */
    private SystemType getOrCreateSystemType(String systemTypeName) {
        return systemTypeRepository.findByName(systemTypeName)
            .orElseGet(() -> {
                SystemType systemType = new SystemType();
                systemType.setName(systemTypeName);
                return systemTypeRepository.save(systemType);
            });
    }
    
    /**
     * Get or create a TransponderFamily entity
     */
    private TransponderFamily getOrCreateTransponderFamily(String familyName) {
        return transponderFamilyRepository.findByName(familyName)
            .orElseGet(() -> {
                TransponderFamily family = new TransponderFamily();
                family.setName(familyName);
                return transponderFamilyRepository.save(family);
            });
    }
    
    /**
     * Get or create a TransponderDetail entity
     */
    private TransponderDetail getOrCreateTransponderDetail(String detail) {
        return transponderDetailRepository.findByDetail(detail)
            .orElseGet(() -> {
                TransponderDetail transponderDetail = new TransponderDetail();
                transponderDetail.setDetail(detail);
                return transponderDetailRepository.save(transponderDetail);
            });
    }
    
    /**
     * Process cross references string into CrossRef entities
     */
    private List<CrossRef> processCrossRefs(String crossRefsStr) {
        List<CrossRef> crossRefs = new ArrayList<>();
        String[] refs = crossRefsStr.split(",");
        
        for (String ref : refs) {
            String cleanRef = ref.trim();
            if (!cleanRef.isEmpty()) {
                CrossRef crossRef = getOrCreateCrossRef(cleanRef);
                crossRefs.add(crossRef);
            }
        }
        
        return crossRefs;
    }
    
    /**
     * Get or create a CrossRef entity
     */
    private CrossRef getOrCreateCrossRef(String label) {
        return crossRefRepository.findByLabel(label)
            .orElseGet(() -> {
                CrossRef crossRef = new CrossRef();
                crossRef.setLabel(label);
                return crossRefRepository.save(crossRef);
            });
    }
    
    /**
     * Process OEM keys string into OemKey entities
     */
    private List<OemKey> processOemKeys(String oemKeysStr) {
        List<OemKey> oemKeys = new ArrayList<>();
        String[] keys = oemKeysStr.split(",");
        
        for (String key : keys) {
            String cleanKey = key.trim();
            if (!cleanKey.isEmpty()) {
                OemKey oemKey = getOrCreateOemKey(cleanKey);
                oemKeys.add(oemKey);
            }
        }
        
        return oemKeys;
    }
    
    /**
     * Get or create an OemKey entity
     */
    private OemKey getOrCreateOemKey(String code) {
        return oemKeyRepository.findByCode(code)
            .orElseGet(() -> {
                OemKey oemKey = new OemKey();
                oemKey.setCode(code);
                return oemKeyRepository.save(oemKey);
            });
    }
    
    /**
     * Process notes string into Note entities
     */
    private List<Note> processNotes(String notesStr) {
        List<Note> notes = new ArrayList<>();
        String[] noteArray = notesStr.split(";");
        
        for (String note : noteArray) {
            String cleanNote = note.trim();
            if (!cleanNote.isEmpty()) {
                Note noteEntity = getOrCreateNote(cleanNote);
                notes.add(noteEntity);
            }
        }
        
        return notes;
    }
    
    /**
     * Get or create a Note entity
     */
    private Note getOrCreateNote(String text) {
        return noteRepository.findByText(text)
            .orElseGet(() -> {
                Note note = new Note();
                note.setText(text);
                return noteRepository.save(note);
            });
    }
    
    /**
     * Get all ETL logs
     */
    public List<EtlLog> getEtlLogs() {
        return etlLogRepository.findAll();
    }
}
