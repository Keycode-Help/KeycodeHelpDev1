package org.rma.kchbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class LookupRequest {
    
    @NotBlank(message = "VIN is required")
    @Pattern(regexp = "^[A-HJ-NPR-Z0-9]{17}$", message = "VIN must be 17 characters and contain only valid characters")
    private String vin;
    
    public String getVin() {
        return vin;
    }
    
    public void setVin(String vin) {
        this.vin = vin;
    }
}
