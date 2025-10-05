package com.metis.backend.opportunities.models.requests;

import java.util.List;

public record UserProfileRequest(
        String name,
        String email,
        String state,
        String city,
        List<String> skills,
        List<String> interests,
        List<String> preferredJobTypes
) {
}
