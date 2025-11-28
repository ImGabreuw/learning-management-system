package com.metis.backend.api;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserResource {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserEntity>> listUsers() {
        // Este método precisaria ser implementado no UserService
        // Por enquanto retorna vazio
        log.info("Listing all users (admin only)");
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserEntity> getUserById(
            @PathVariable String userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        UserEntity user = (UserEntity) userService.loadUserByUsername(userId);
        
        if (user == null) {
            log.warn("User not found: {}", userId);
            return ResponseEntity.notFound().build();
        }

        // Usuários só podem ver seu próprio perfil, exceto admins
        String currentUserEmail = userDetails.getUsername();
        if (!currentUserEmail.equals(userId) && !userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            log.warn("User {} attempted to access profile of {}", currentUserEmail, userId);
            return ResponseEntity.status(403).build();
        }

        log.info("User profile retrieved: {}", userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserEntity> updateUser(
            @PathVariable String userId,
            @RequestBody Map<String, Object> updates,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // Verificar se o usuário pode atualizar este perfil
        String currentUserEmail = userDetails.getUsername();
        if (!currentUserEmail.equals(userId) && !userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            log.warn("User {} attempted to update profile of {}", currentUserEmail, userId);
            return ResponseEntity.status(403).build();
        }

        UserEntity user = (UserEntity) userService.loadUserByUsername(userId);
        if (user == null) {
            log.warn("User not found for update: {}", userId);
            return ResponseEntity.notFound().build();
        }

        // Atualizar apenas campos permitidos
        if (updates.containsKey("name")) {
            user.setName((String) updates.get("name"));
        }
        if (updates.containsKey("phone")) {
            user.setPhone((String) updates.get("phone"));
        }
        if (updates.containsKey("bio")) {
            user.setBio((String) updates.get("bio"));
        }
        if (updates.containsKey("location")) {
            user.setLocation((String) updates.get("location"));
        }
        if (updates.containsKey("birthDate")) {
            // Converter string ISO para LocalDateTime
            String birthDateStr = (String) updates.get("birthDate");
            if (birthDateStr != null && !birthDateStr.isEmpty()) {
                user.setBirthDate(LocalDateTime.parse(birthDateStr + "T00:00:00"));
            }
        }

        user.setUpdatedAt(LocalDateTime.now());
        
        // Salvar usuário atualizado
        userService.save(user);
        
        log.info("User profile updated: {}", userId);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(
            @PathVariable String userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        UserEntity user = (UserEntity) userService.loadUserByUsername(userId);
        if (user == null) {
            log.warn("User not found for deletion: {}", userId);
            return ResponseEntity.notFound().build();
        }

        // Soft delete: desabilitar o usuário
        user.setEnabled(false);
        user.setUpdatedAt(LocalDateTime.now());
        userService.save(user);

        log.info("User deleted (disabled): {} by admin: {}", userId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

}
