package org.rma.kchbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProcessRequestDto {
    @NotNull(message = "Vehicle ID cannot be null")
    private Long vehicleId;

    @NotBlank(message = "Keycode cannot be empty")
    private String keycode;
}