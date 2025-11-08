package com.metis.backend.opportunities.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.metis.backend.opportunities.models.entities.EdgeEntity;
import com.metis.backend.opportunities.models.entities.EdgeId;
import com.metis.backend.opportunities.models.entities.NodeEntity;
import com.metis.backend.opportunities.models.requests.OpportunityRequest;
import com.metis.backend.opportunities.models.requests.UserProfileRequest;
import com.metis.backend.opportunities.models.response.OpportunityCreatedResponse;
import com.metis.backend.opportunities.models.response.UserProfileCreatedResponse;
import com.metis.backend.opportunities.repositories.EdgeRepository;
import com.metis.backend.opportunities.repositories.NodeRepository;
import com.metis.backend.shared.Utility;
import com.metis.opportunity_recommendation_algorithm.internal.models.enums.NodeType;
import com.metis.opportunity_recommendation_algorithm.internal.models.enums.RelationType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KnowledgeGraphService {

    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;

    @Transactional
    public UserProfileCreatedResponse saveUserProfile(UserProfileRequest request) {
        NodeEntity userNode = new NodeEntity();
        userNode.setId(UUID.randomUUID().toString());
        userNode.setType(NodeType.STUDENT);
        userNode.setProperty("name", request.name());
        userNode.setProperty("email", request.email());
        String preferredJobTypes = Utility.serializeListToString(request.preferredJobTypes());
        userNode.setProperty("preferredJobTypes", preferredJobTypes);
        userNode.setUpdatedAt(LocalDateTime.now());
        userNode.setCreatedAt(LocalDateTime.now());

        NodeEntity userNodeSaved = nodeRepository.save(userNode);

        List<String> skillsId = new ArrayList<>();
        for (String skill : request.skills()) {
            NodeEntity skillNode = new NodeEntity();
            String nodeId = Utility.convertToNodeId(skill);
            skillNode.setId(nodeId);
            skillNode.setType(NodeType.SKILL);
            skillNode.setProperty("name", skill);
            skillNode.setUpdatedAt(LocalDateTime.now());
            skillNode.setCreatedAt(LocalDateTime.now());

            NodeEntity skillNodeSaved = nodeRepository.save(skillNode);
            skillsId.add(nodeId);

            EdgeEntity hasSkillEdge = new EdgeEntity();
            EdgeId edgeId = new EdgeId();
            edgeId.setSourceId(userNodeSaved.getId());
            edgeId.setTargetId(skillNodeSaved.getId());
            hasSkillEdge.setId(edgeId);
            hasSkillEdge.setType(RelationType.HAS_SKILL);
            hasSkillEdge.setCreatedAt(LocalDateTime.now());

            edgeRepository.save(hasSkillEdge);
        }

        List<String> interestsId = new ArrayList<>();
        for (String interest : request.interests()) {
            NodeEntity interestNode = new NodeEntity();
            String nodeId = Utility.convertToNodeId(interest);
            interestNode.setId(nodeId);
            interestNode.setType(NodeType.THEME);
            interestNode.setProperty("name", interest);
            interestNode.setUpdatedAt(LocalDateTime.now());
            interestNode.setCreatedAt(LocalDateTime.now());

            NodeEntity interestNodeSaved = nodeRepository.save(interestNode);
            interestsId.add(nodeId);

            EdgeEntity interestedInEdge = new EdgeEntity();
            EdgeId edgeId = new EdgeId();
            edgeId.setSourceId(userNodeSaved.getId());
            edgeId.setTargetId(interestNodeSaved.getId());
            interestedInEdge.setId(edgeId);
            interestedInEdge.setType(RelationType.INTERESTED_IN);
            interestedInEdge.setCreatedAt(LocalDateTime.now());

            edgeRepository.save(interestedInEdge);
        }

        UserProfileCreatedResponse response = new UserProfileCreatedResponse();
        response.setId(userNode.getId());
        response.setSkillsId(skillsId);
        response.setInterestsId(interestsId);
        return response;
    }

    @Transactional
    public OpportunityCreatedResponse saveOpportunity(OpportunityRequest request) {
        NodeEntity opportunityNode = new NodeEntity();
        opportunityNode.setId(UUID.randomUUID().toString());
        opportunityNode.setType(NodeType.OPPORTUNITY);
        opportunityNode.setProperty("title", request.title());
        opportunityNode.setProperty("description", request.description());
        opportunityNode.setProperty("location", request.location());
        opportunityNode.setProperty("type", request.type());
        opportunityNode.setProperty("organization", request.organization());
        opportunityNode.setProperty("applicationUrl", request.applicationUrl());
        opportunityNode.setProperty("applicationDeadline", request.applicationDeadline());
        opportunityNode.setUpdatedAt(LocalDateTime.now());
        opportunityNode.setCreatedAt(LocalDateTime.now());

        if (request.minimumSalary() != null) {
            opportunityNode.setProperty("minimumSalary", request.minimumSalary().toString());
        }

        if (request.maximumSalary() != null) {
            opportunityNode.setProperty("maximumSalary", request.maximumSalary().toString());
        }

        NodeEntity opportunityNodeSaved = nodeRepository.save(opportunityNode);

        List<String> requiredSkillsId = new ArrayList<>();
        for (String skill : request.requiredSkills()) {
            NodeEntity skillNode = new NodeEntity();
            String nodeId = Utility.convertToNodeId(skill);
            skillNode.setId(nodeId);
            skillNode.setType(NodeType.SKILL);
            skillNode.setProperty("name", skill);
            skillNode.setUpdatedAt(LocalDateTime.now());
            skillNode.setCreatedAt(LocalDateTime.now());

            NodeEntity skillNodeSaved = nodeRepository.save(skillNode);
            requiredSkillsId.add(nodeId);

            EdgeEntity requiresSkillEdge = new EdgeEntity();
            EdgeId edgeId = new EdgeId();
            edgeId.setSourceId(opportunityNodeSaved.getId());
            edgeId.setTargetId(skillNodeSaved.getId());
            requiresSkillEdge.setId(edgeId);
            requiresSkillEdge.setType(RelationType.REQUIRES_SKILL);
            requiresSkillEdge.setCreatedAt(LocalDateTime.now());

            edgeRepository.save(requiresSkillEdge);
        }

        List<String> relatedThemesId = new ArrayList<>();
        for (String theme : request.relatedThemes()) {
            NodeEntity themeNode = new NodeEntity();
            String nodeId = Utility.convertToNodeId(theme);
            themeNode.setId(nodeId);
            themeNode.setType(NodeType.THEME);
            themeNode.setProperty("name", theme);
            themeNode.setUpdatedAt(LocalDateTime.now());
            themeNode.setCreatedAt(LocalDateTime.now());

            NodeEntity themeNodeSaved = nodeRepository.save(themeNode);
            relatedThemesId.add(nodeId);

            EdgeEntity relatedToThemeEdge = new EdgeEntity();
            EdgeId edgeId = new EdgeId();
            edgeId.setSourceId(opportunityNodeSaved.getId());
            edgeId.setTargetId(themeNodeSaved.getId());
            relatedToThemeEdge.setId(edgeId);
            relatedToThemeEdge.setType(RelationType.RELATED_TO_THEME);
            relatedToThemeEdge.setCreatedAt(LocalDateTime.now());

            edgeRepository.save(relatedToThemeEdge);
        }

        OpportunityCreatedResponse response = new OpportunityCreatedResponse();
        response.setId(opportunityNode.getId());
        response.setRequiredSkillsId(requiredSkillsId);
        response.setRelatedThemesId(relatedThemesId);

        return response;
    }

}
