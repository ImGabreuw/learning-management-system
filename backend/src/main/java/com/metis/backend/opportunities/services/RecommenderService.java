package com.metis.backend.opportunities.services;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import com.metis.backend.opportunities.mapper.NodeMapper;
import com.metis.backend.opportunities.models.entities.EdgeEntity;
import com.metis.backend.opportunities.models.entities.NodeEntity;
import com.metis.backend.opportunities.repositories.EdgeRepository;
import com.metis.backend.opportunities.repositories.NodeRepository;
import com.metis.opportunity_recommendation_algorithm.api.Recommender;
import com.metis.opportunity_recommendation_algorithm.api.RecommenderFactory;
import com.metis.opportunity_recommendation_algorithm.api.response.OpportunityResponse;
import com.metis.opportunity_recommendation_algorithm.internal.models.KnowledgeGraph;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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

        Set<String> targetNodeIds = new HashSet<>();
        for (EdgeEntity edgeEntity : connectedFrom) {
            String targetId = edgeEntity.getId().getTargetId();
            targetNodeIds.add(targetId);
        }

        Map<String, NodeEntity> targetNodes = new HashMap<>();
        for (NodeEntity nodeEntity : nodeRepository.findAllById(targetNodeIds)) {
            if (targetNodes.containsKey(nodeEntity.getId())) {
                log.warn("Duplicate node found with id: {}", nodeEntity.getId());
                continue;
            }
            targetNodes.put(nodeEntity.getId(), nodeEntity);
        }

        for (EdgeEntity userEdge : connectedFrom) {
            NodeEntity targetNode = targetNodes.get(userEdge.getId().getTargetId());
            if (targetNode == null) {
                log.warn("Invalid edge found with missing target node: {}", userEdge);
                continue;
            }

            this.graph.addNode(NodeMapper.toLibrary(targetNode));
            String targetNodeId = targetNode.getId();
            this.graph.addEdge(userId, userEdge.getType(), targetNodeId);

            List<EdgeEntity> connectedTo = edgeRepository.findAllConnectedToExcluding(targetNodeId, discoveredOpportunities);

            Set<String> sourceNodeIds = new HashSet<>();
            for (EdgeEntity edge : connectedTo) {
                String sourceId = edge.getId().getSourceId();
                sourceNodeIds.add(sourceId);
            }

            Map<String, NodeEntity> sourceNodes = new HashMap<>();
            for (NodeEntity n : nodeRepository.findAllById(sourceNodeIds)) {
                if (sourceNodes.containsKey(n.getId())) {
                    log.warn("Duplicate node found with id: {}", n.getId());
                    continue;
                }
                sourceNodes.put(n.getId(), n);
            }

            for (EdgeEntity opportunityEdge : connectedTo) {
                NodeEntity sourceNode = sourceNodes.get(opportunityEdge.getId().getSourceId());
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
