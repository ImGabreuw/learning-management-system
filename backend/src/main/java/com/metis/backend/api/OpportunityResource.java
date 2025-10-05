package com.metis.backend.api;

import com.metis.backend.opportunities.models.requests.OpportunityRequest;
import com.metis.backend.opportunities.models.requests.UserProfileRequest;
import com.metis.backend.opportunities.models.response.OpportunityCreatedResponse;
import com.metis.backend.opportunities.models.response.UserProfileCreatedResponse;
import com.metis.backend.opportunities.services.KnowledgeGraphBatchService;
import com.metis.backend.opportunities.services.KnowledgeGraphService;
import com.metis.backend.opportunities.services.RecommenderService;
import com.metis.opportunity_recommendation_algorithm.api.response.OpportunityResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
@RequiredArgsConstructor
public class OpportunityResource {

    private final KnowledgeGraphService knowledgeGraphService;
    private final KnowledgeGraphBatchService knowledgeGraphBatchService;
    private final RecommenderService recommenderService;

    @PostMapping
    public ResponseEntity<OpportunityCreatedResponse> saveOpportunity(@RequestBody OpportunityRequest request) {
        OpportunityCreatedResponse response = knowledgeGraphService.saveOpportunity(request);

        URI location = UriComponentsBuilder
                .fromPath("/api/opportunities/{id}")
                .buildAndExpand(response.getId())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<OpportunityCreatedResponse>> saveOpportunities(
            @RequestBody List<OpportunityRequest> requests
    ) {
        List<OpportunityCreatedResponse> responses = knowledgeGraphBatchService.saveOpportunities(requests);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/user-profile")
    public ResponseEntity<UserProfileCreatedResponse> saveUserProfile(@RequestBody UserProfileRequest request) {
        UserProfileCreatedResponse userProfile = knowledgeGraphService.saveUserProfile(request);

        URI location = UriComponentsBuilder
                .fromPath("/api/opportunities/user-profile/{id}")
                .buildAndExpand(userProfile.getId())
                .toUri();

        return ResponseEntity.created(location).body(userProfile);
    }

    @PostMapping("/user-profile/batch")
    public ResponseEntity<List<UserProfileCreatedResponse>> saveUserProfiles(
            @RequestBody List<UserProfileRequest> requests
    ) {
        List<UserProfileCreatedResponse> responses = knowledgeGraphBatchService.saveUserProfiles(requests);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<List<OpportunityResponse>> getRecommendations(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int topN
    ) {
        List<OpportunityResponse> recommendations = recommenderService.recommend(userId, topN);
        return ResponseEntity.ok(recommendations);
    }

}
