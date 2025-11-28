package com.metis.backend.notifications.repository;

import com.metis.backend.notifications.model.NotificationEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<NotificationEntity, String> {
    
    List<NotificationEntity> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<NotificationEntity> findByUserIdAndReadOrderByCreatedAtDesc(String userId, boolean read);
    
    long countByUserIdAndRead(String userId, boolean read);
}
