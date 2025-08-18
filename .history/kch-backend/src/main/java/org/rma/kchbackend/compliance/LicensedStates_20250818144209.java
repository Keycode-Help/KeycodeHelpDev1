package org.rma.kchbackend.compliance;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class LicensedStates {

    private static final Set<String> DEFAULT = Set.of(
            "Alabama", "California", "Connecticut", "Illinois", "Louisiana",
            "Maryland", "Nevada", "New Jersey", "North Carolina",
            "Oklahoma", "Oregon", "Texas", "Virginia"
    );

    private final Set<String> stateSet;

    public LicensedStates(@Value("${KCH_LICENSED_STATES:}") String override) {
        if (override == null || override.isBlank()) {
            this.stateSet = DEFAULT;
        } else {
            this.stateSet = Arrays.stream(override.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toUnmodifiableSet());
        }
    }

    public boolean requiresLicense(String state) {
        return state != null && stateSet.contains(state);
    }

    public Set<String> all() {
        return stateSet;
    }
}


