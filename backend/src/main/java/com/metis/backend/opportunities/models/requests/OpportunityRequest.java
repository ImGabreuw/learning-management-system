package com.metis.backend.opportunities.models.requests;

import java.math.BigDecimal;
import java.util.List;

public record OpportunityRequest(
        String title,
        String description,
        List<String> requiredSkills,
        List<String> relatedThemes,
        String location,
        String type,
        String organization,
        String applicationUrl,
        String applicationDeadline,

        BigDecimal minimumSalary,
        BigDecimal maximumSalary
) {
}
