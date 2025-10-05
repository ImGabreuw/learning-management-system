package com.metis.backend.opportunities.models.response;

import lombok.Data;

import java.util.List;

@Data
public class OpportunityCreatedResponse {

    private String id;

    private List<String> requiredSkillsId;

    private List<String> relatedThemesId;

}
