package com.metis.backend.api;

import com.metis.backend.notifications.model.NotificationEntity;
import com.metis.backend.notifications.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationResource {
    
    private static final Logger log = LoggerFactory.getLogger(NotificationResource.class);
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * GET /api/notifications - Lista todas as notificações do usuário
     */
    @GetMapping
    public ResponseEntity<List<NotificationEntity>> getUserNotifications(Authentication authentication) {
        String userId = authentication.getName();
        log.info("Buscando notificações para usuário: {}", userId);
        
        List<NotificationEntity> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * GET /api/notifications/unread - Lista notificações não lidas
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationEntity>> getUnreadNotifications(Authentication authentication) {
        String userId = authentication.getName();
        log.info("Buscando notificações não lidas para usuário: {}", userId);
        
        List<NotificationEntity> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * GET /api/notifications/count - Conta notificações não lidas
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        String userId = authentication.getName();
        
        long count = notificationService.getUnreadCount(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", count);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /api/notifications - Cria uma nova notificação
     */
    @PostMapping
    public ResponseEntity<NotificationEntity> createNotification(
            @RequestBody NotificationEntity notification,
            Authentication authentication) {
        
        // Definir userId da autenticação se não fornecido
        if (notification.getUserId() == null) {
            notification.setUserId(authentication.getName());
        }
        
        log.info("Criando notificação para usuário: {}", notification.getUserId());
        
        NotificationEntity created = notificationService.createNotification(notification);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    /**
     * PUT /api/notifications/{id}/read - Marca notificação como lida
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationEntity> markAsRead(@PathVariable String id) {
        log.info("Marcando notificação {} como lida", id);
        
        return notificationService.markAsRead(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * PUT /api/notifications/read-all - Marca todas como lidas
     */
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        String userId = authentication.getName();
        log.info("Marcando todas as notificações como lidas para usuário: {}", userId);
        
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
    
    /**
     * DELETE /api/notifications/{id} - Remove uma notificação
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String id) {
        log.info("Removendo notificação: {}", id);
        
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * DELETE /api/notifications - Remove todas as notificações do usuário
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllNotifications(Authentication authentication) {
        String userId = authentication.getName();
        log.info("Removendo todas as notificações do usuário: {}", userId);
        
        notificationService.deleteAllUserNotifications(userId);
        return ResponseEntity.noContent().build();
    }
}
