package org.rma.kchbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.rma.kchbackend.dto.LookupRequest;
import org.rma.kchbackend.dto.LookupResponse;
import org.rma.kchbackend.dto.KeycodeCreateDto;
import org.rma.kchbackend.dto.KeycodeRequestDto;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/keycodes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:51731", "http://localhost:51732", "http://localhost:51733", "http://localhost:51734"})
public class KeycodeController {

    @PostMapping("/lookup")
    public ResponseEntity<LookupResponse> lookup(@RequestBody LookupRequest req) {
        // TODO: Implement VIN lookup logic
        LookupResponse response = new LookupResponse();
        response.setVin(req.getVin());
        response.setSuccess(true);
        response.setMessage("VIN lookup successful");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/requests")
    public ResponseEntity<KeycodeRequestDto> create(@RequestBody KeycodeCreateDto dto) {
        // TODO: Implement keycode request creation
        KeycodeRequestDto response = new KeycodeRequestDto();
        response.setId(1L);
        response.setVin(dto.getVin());
        response.setStatus("PENDING");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/requests")
    public ResponseEntity<List<KeycodeRequestDto>> myRequests() {
        // TODO: Implement current user requests history
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/requests/all")
    @PreAuthorize("hasAnyAuthority('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<KeycodeRequestDto>> allRequests() {
        // TODO: Implement all requests for admin view
        return ResponseEntity.ok(List.of());
    }
}
