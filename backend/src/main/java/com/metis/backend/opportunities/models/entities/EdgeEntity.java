package com.metis.backend.opportunities.models.entities;

import com.metis.opportunity_recommendation_algorithm.internal.models.enums.RelationType;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "edges")
@Data
public class EdgeEntity {

    /**
     * Setting sourceId and targetId as composite key
     * to avoid duplicate edges between the same pair of nodes (parallel edges).
     */
    @Id
    private EdgeId id;

    private RelationType type;

    private LocalDateTime createdAt;

}
