package org.rma.kchbackend.compliance;

import java.util.List;

public record ComplianceRequirement(
        boolean required,
        List<String> requiredDocs,
        String userMessage
) {}


