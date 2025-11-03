package com.metis.backend.api;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.auth.models.response.AuthResponse;
import com.metis.backend.auth.service.AuthService;
import com.metis.backend.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ⚠️ ENDPOINT APENAS PARA DESENVOLVIMENTO E TESTES
 * 
 * Este endpoint gera tokens JWT SEM OAuth2 para permitir testes de integração
 * quando não há frontend disponível.
 * 
 * ❌ NUNCA USAR EM PRODUÇÃO!
 */
@Slf4j
@RestController
@RequestMapping("/api/dev/auth")
@RequiredArgsConstructor
@Profile("dev") // Só ativa no perfil dev
public class DevAuthResource {

    private final UserService userService;
    private final AuthService authService;

    /**
     * Gera tokens para um email específico (para testes)
     * 
     * GET /api/dev/auth/generate-token?email=seu.email@mackenzie.br
     */
    @GetMapping("/generate-token")
    public ResponseEntity<AuthResponse> generateToken(@RequestParam String email) {
        log.warn("⚠️ DEV ONLY: Generating token for email: {}", email);

        try {
            // Cria ou busca usuário (validateEmailDomain é chamado internamente)
            UserEntity user = userService.createOrUpdateUser(
                    email,
                    "Dev User - " + email.split("@")[0],
                    "dev-microsoft-id-" + System.currentTimeMillis()
            );

            // Gera tokens usando AuthService
            AuthService.TokenPair tokens = authService.generateTokensForUser(user);

            List<String> roles = user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            AuthResponse response = AuthResponse.builder()
                    .accessToken(tokens.accessToken())
                    .refreshToken(tokens.refreshToken())
                    .tokenType("Bearer")
                    .expiresIn(86400L)
                    .userInfo(AuthResponse.UserInfo.builder()
                            .email(user.getEmail())
                            .name(user.getName())
                            .roles(roles)
                            .build())
                    .build();

            log.info("✅ Token generated successfully for: {}", email);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("❌ Invalid email domain: {}", email);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Gera tokens para admin (para testes de autorização)
     * 
     * GET /api/dev/auth/generate-admin-token
     */
    @GetMapping("/generate-admin-token")
    public ResponseEntity<AuthResponse> generateAdminToken() {
        return generateToken("admin@mackenzie.br");
    }

    /**
     * Gera tokens para usuário comum (para testes de autorização)
     * 
     * GET /api/dev/auth/generate-user-token
     */
    @GetMapping("/generate-user-token")
    public ResponseEntity<AuthResponse> generateUserToken() {
        return generateToken("user@mackenzie.br");
    }

}
