package com.metis.backend.opportunities.services;

import com.metis.backend.opportunities.mapper.NodeMapper;
import com.metis.backend.opportunities.models.entities.EdgeEntity;
import com.metis.backend.opportunities.models.entities.NodeEntity;
import com.metis.backend.opportunities.repositories.EdgeRepository;
import com.metis.backend.opportunities.repositories.NodeRepository;
import com.metis.opportunity_recommendation_algorithm.api.Recommender;
import com.metis.opportunity_recommendation_algorithm.api.RecommenderFactory;
import com.metis.opportunity_recommendation_algorithm.api.response.OpportunityResponse;
import com.metis.opportunity_recommendation_algorithm.internal.models.KnowledgeGraph;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Scope("prototype")
@RequiredArgsConstructor
@Slf4j
public class RecommenderService {

    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;

    private KnowledgeGraph graph;

    private void initialize(String userId) {

        NodeEntity userNode = nodeRepository
                .findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        this.graph = new KnowledgeGraph();
        this.graph.addNode(NodeMapper.toLibrary(userNode));

        Set<String> discoveredOpportunities = new HashSet<>();
        List<EdgeEntity> connectedFrom = edgeRepository.findAllConnectedFrom(userId);
        for (EdgeEntity userEdge : connectedFrom) {
            NodeEntity targetNode = nodeRepository.findById(userEdge.getId().getTargetId()).orElse(null);

            if (targetNode == null) {
                log.warn("Invalid edge found with missing target node: {}", userEdge);
                continue;
            }

            this.graph.addNode(NodeMapper.toLibrary(targetNode));

            String targetNodeId = targetNode.getId();
            this.graph.addEdge(userId, userEdge.getType(), targetNodeId);

            List<EdgeEntity> connectedTo = edgeRepository.findAllConnectedToExcluding(targetNodeId, discoveredOpportunities);
            for (EdgeEntity opportunityEdge : connectedTo) {
                NodeEntity sourceNode = nodeRepository.findById(opportunityEdge.getId().getSourceId()).orElse(null);

                if (sourceNode == null) {
                    log.warn("Invalid edge found with missing source node: {}", opportunityEdge);
                    continue;
                }

                this.graph.addNode(NodeMapper.toLibrary(sourceNode));

                String sourceNodeId = sourceNode.getId();
                this.graph.addEdge(sourceNodeId, opportunityEdge.getType(), targetNodeId);

                if (sourceNode.isOpportunityNode()) {
                    discoveredOpportunities.add(sourceNodeId);
                }
            }
        }
    }

    public List<OpportunityResponse> recommend(String userId, int topN) {
        initialize(userId);

        Recommender recommender = RecommenderFactory.create(graph);
        List<OpportunityResponse> recommendations = recommender.recommend(userId, topN);
        log.info("recommendations: {}", recommendations);

        return recommendations;
    }

}
