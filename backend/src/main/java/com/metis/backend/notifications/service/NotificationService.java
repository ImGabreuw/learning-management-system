package com.metis.backend.notifications.service;

import com.metis.backend.notifications.model.NotificationEntity;
import com.metis.backend.notifications.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public List<NotificationEntity> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<NotificationEntity> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadOrderByCreatedAtDesc(userId, false);
    }
    
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndRead(userId, false);
    }
    
    public NotificationEntity createNotification(NotificationEntity notification) {
        return notificationRepository.save(notification);
    }
    
    public Optional<NotificationEntity> markAsRead(String notificationId) {
        Optional<NotificationEntity> notification = notificationRepository.findById(notificationId);
        notification.ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        return notification;
    }
    
    public void markAllAsRead(String userId) {
        List<NotificationEntity> unread = getUnreadNotifications(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
    
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    public void deleteAllUserNotifications(String userId) {
        List<NotificationEntity> userNotifications = getUserNotifications(userId);
        notificationRepository.deleteAll(userNotifications);
    }
}
