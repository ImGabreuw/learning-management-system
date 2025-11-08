package com.metis.backend.opportunities.repositories;

import java.util.List;
import java.util.Set;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.metis.backend.opportunities.models.entities.EdgeEntity;
import com.metis.backend.opportunities.models.entities.EdgeId;

public interface EdgeRepository extends MongoRepository<EdgeEntity, EdgeId> {

    @Query("{ 'sourceNodeId': ?0 }")
    List<EdgeEntity> findAllConnectedFrom(String sourceNodeId);

    @Query("{ 'targetNodeId': ?0 }")
    List<EdgeEntity> findAllConnectedTo(String targetNodeId);

    /**
     * Evitar o problema de N+1 queries. Ao passar uma lista de IDs já processados (excluded),
     * você evita buscar arestas ligadas a nós já visitados, reduzindo consultas desnecessárias e melhorando a performance.
     */
    @Query("{ 'id.targetId': ?0, 'id.sourceId': { $nin: ?1 } }")
    List<EdgeEntity> findAllConnectedToExcluding(String targetNodeId, Set<String> excludedSourceIds);

}
