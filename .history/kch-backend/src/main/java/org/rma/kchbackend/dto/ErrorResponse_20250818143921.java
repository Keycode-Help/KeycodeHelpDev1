package org.rma.kchbackend.dto;

import java.time.OffsetDateTime;
import java.util.Map;

public record ErrorResponse(
        String code,
        String message,
        Map<String, Object> meta,
        OffsetDateTime timestamp
) {
    public static ErrorResponse of(String code, String message, Map<String, Object> meta) {
        return new ErrorResponse(code, message, meta, OffsetDateTime.now());
    }
}


