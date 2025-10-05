package com.metis.backend.opportunities.mapper;

import com.metis.backend.opportunities.models.entities.NodeEntity;
import com.metis.opportunity_recommendation_algorithm.internal.models.Node;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class NodeMapper {

    public static Node toLibrary(NodeEntity entity) {
        return new Node(
                entity.getId(),
                entity.getType()
        );
    }

    public static NodeEntity toEntity(Node node) {
        NodeEntity entity = new NodeEntity();
        entity.setId(node.getId());
        entity.setType(node.getType());
        return entity;
    }

}
