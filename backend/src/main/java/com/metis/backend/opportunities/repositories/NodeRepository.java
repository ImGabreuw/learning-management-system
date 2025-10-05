package com.metis.backend.opportunities.repositories;

import com.metis.backend.opportunities.models.entities.NodeEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NodeRepository extends MongoRepository<NodeEntity, String> {
}
