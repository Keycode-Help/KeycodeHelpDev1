package org.rma.kchbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SubscriptionDto {
    private Long id;
    private String tier;
    private String userEmail;
}
