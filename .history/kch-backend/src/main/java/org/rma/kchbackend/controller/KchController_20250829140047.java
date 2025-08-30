package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.Make;
import org.rma.kchbackend.model.Model;
import org.rma.kchbackend.model.SystemType;
import org.rma.kchbackend.service.MakeService;
import org.rma.kchbackend.service.ModelService;
import org.rma.kchbackend.service.SystemTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kch")
@CrossOrigin(origins = {"http://localhost:5173", "https://keycode-help-dev1.vercel.app"})
public class KchController {

    private final MakeService makeService;
    private final ModelService modelService;
    private final SystemTypeService systemTypeService;

    @Autowired
    public KchController(MakeService makeService, ModelService modelService, SystemTypeService systemTypeService) {
        this.makeService = makeService;
        this.modelService = modelService;
        this.systemTypeService = systemTypeService;
    }

    @GetMapping("/makes")
    public ResponseEntity<List<Make>> getMakes() {
        List<Make> makes = makeService.getMakes();
        return ResponseEntity.ok(makes);
    }

    @GetMapping("/makes/{makeId}/models")
    public ResponseEntity<List<Model>> getModelsByMake(@PathVariable Long makeId) {
        List<Model> models = modelService.getModelsByMakeId(makeId);
        return ResponseEntity.ok(models);
    }

    @GetMapping("/system-types")
    public ResponseEntity<List<SystemType>> getSystemTypes() {
        List<SystemType> systemTypes = systemTypeService.getSystemTypes();
        return ResponseEntity.ok(systemTypes);
    }

    @GetMapping("/transponder-families")
    public ResponseEntity<List<Object>> getTransponderFamilies() {
        // Temporarily return empty list since TransponderFamily was moved to temp
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/search")
    public ResponseEntity<Object> searchEntries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long makeId,
            @RequestParam(required = false) Long modelId,
            @RequestParam(required = false) Long systemTypeId) {
        
        // Temporarily return empty results since the Entry entity was moved to temp
        return ResponseEntity.ok(Map.of(
            "content", List.of(),
            "totalPages", 0,
            "totalElements", 0L,
            "currentPage", page
        ));
    }
}
