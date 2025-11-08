package com.metis.backend.opportunities.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.metis.backend.opportunities.models.entities.NodeEntity;

public interface NodeRepository extends MongoRepository<NodeEntity, String> {
}
