package org.rma.kchbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class KeycodeCreateDto {
    
    @NotBlank(message = "VIN is required")
    @Pattern(regexp = "^[A-HJ-NPR-Z0-9]{17}$", message = "VIN must be 17 characters and contain only valid characters")
    private String vin;
    
    private String notes;
    private String urgency;
    
    public String getVin() {
        return vin;
    }
    
    public void setVin(String vin) {
        this.vin = vin;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getUrgency() {
        return urgency;
    }
    
    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }
}
