package com.metis.backend.opportunities.models.entities;

import com.metis.opportunity_recommendation_algorithm.internal.models.enums.NodeType;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "nodes")
@Data
public class NodeEntity {

    @Id
    private String id;

    private NodeType type;

    private Map<String, Object> properties = new HashMap<>();

    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;

    public void setProperty(String key, Object value) {
        properties.put(key, value);
    }

    public boolean isOpportunityNode() {
        if (type == null) {
            return false;
        }
        return type == NodeType.OPPORTUNITY;
    }

}
