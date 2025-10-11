package com.metis.backend.auth.repository;

import com.metis.backend.auth.models.entities.RoleEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends MongoRepository<RoleEntity, String> {

    Optional<RoleEntity> findByName(String name);

    boolean existsByName(String name);

}
