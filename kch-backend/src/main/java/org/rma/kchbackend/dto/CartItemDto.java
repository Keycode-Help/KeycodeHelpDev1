package org.rma.kchbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartItemDto {
    private Long id;
    private String make;
    private String model;
    private String vin;
}