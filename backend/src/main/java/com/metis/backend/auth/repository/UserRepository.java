package com.metis.backend.auth.repository;

import com.metis.backend.auth.models.entities.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {
    
    Optional<UserEntity> findByEmail(String email);
    
    Optional<UserEntity> findByMicrosoftId(String microsoftId);
    
    boolean existsByEmail(String email);
    
    boolean existsByMicrosoftId(String microsoftId);

}
