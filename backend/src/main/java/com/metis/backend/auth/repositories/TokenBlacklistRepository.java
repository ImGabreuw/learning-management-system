package com.metis.backend.auth.repositories;

import com.metis.backend.auth.models.entities.TokenBlacklist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenBlacklistRepository extends MongoRepository<TokenBlacklist, String> {

    Optional<TokenBlacklist> findByToken(String token);

    boolean existsByToken(String token);
}
