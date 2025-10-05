package com.metis.backend.opportunities.services;

import com.metis.backend.opportunities.models.requests.OpportunityRequest;
import com.metis.backend.opportunities.models.requests.UserProfileRequest;
import com.metis.backend.opportunities.models.response.OpportunityCreatedResponse;
import com.metis.backend.opportunities.models.response.UserProfileCreatedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KnowledgeGraphBatchService {

    private final KnowledgeGraphService knowledgeGraphService;

    @Transactional
    public List<OpportunityCreatedResponse> saveOpportunities(List<OpportunityRequest> requests) {
        List<OpportunityCreatedResponse> responses = new ArrayList<>();
        for (OpportunityRequest request : requests) {
            OpportunityCreatedResponse response = knowledgeGraphService.saveOpportunity(request);
            responses.add(response);
        }
        return responses;
    }

    @Transactional
    public List<UserProfileCreatedResponse> saveUserProfiles(List<UserProfileRequest> requests) {
        List<UserProfileCreatedResponse> responses = new ArrayList<>();
        for (UserProfileRequest request : requests) {
            UserProfileCreatedResponse response = knowledgeGraphService.saveUserProfile(request);
            responses.add(response);
        }
        return responses;
    }

}
