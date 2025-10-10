package br.mackenzie.auth.controller;

import br.mackenzie.auth.dto.ApiResponse;
import br.mackenzie.auth.dto.AuthResponse;
import br.mackenzie.auth.dto.RefreshTokenRequest;
import br.mackenzie.auth.model.User;
import br.mackenzie.auth.service.AuthService;
import br.mackenzie.auth.service.JwtService;
import br.mackenzie.auth.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller REST para autenticação e autorização
 * 
 * Endpoints disponíveis:
 * - GET /api/v1/auth/login - Redireciona para login OAuth2 Microsoft
 * - GET /api/v1/auth/oauth2/success - Callback após login OAuth2 bem-sucedido
 * - POST /api/v1/auth/refresh - Renova access token usando refresh token
 * - POST /api/v1/auth/logout - Realiza logout invalidando o token
 * - GET /api/v1/auth/me - Retorna informações do usuário autenticado
 * - GET /api/v1/auth/validate - Valida se o token é válido
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;
    
    /**
     * Endpoint para iniciar login OAuth2 Microsoft
     * Redireciona automaticamente para a página de login da Microsoft
     */
    @GetMapping("/login")
    public ResponseEntity<ApiResponse> login() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Redirecione para /oauth2/authorization/microsoft para fazer login",
                        Map.of("loginUrl", "/oauth2/authorization/microsoft")
                )
        );
    }
    
    /**
     * Callback após login OAuth2 bem-sucedido
     * Retorna os tokens JWT gerados
     */
    @GetMapping("/oauth2/success")
    public ResponseEntity<AuthResponse> oauth2Success(
            @RequestParam String accessToken,
            @RequestParam String refreshToken,
            @RequestParam String tokenType
    ) {
        try {
            // Extrai informações do usuário do token
            String email = jwtService.extractUsername(accessToken);
            User user = (User) userService.loadUserByUsername(email);
            
            List<String> roles = user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();
            
            AuthResponse response = AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType(tokenType)
                    .expiresIn(86400L) // 24 horas
                    .userInfo(AuthResponse.UserInfo.builder()
                            .email(user.getEmail())
                            .name(user.getName())
                            .roles(roles)
                            .build())
                    .build();
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Erro ao processar callback OAuth2: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Renova o access token usando o refresh token
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            Map<String, String> tokens = authService.refreshToken(request.getRefreshToken());
            return ResponseEntity.ok(ApiResponse.success("Token renovado com sucesso", tokens));
            
        } catch (Exception e) {
            log.error("Erro ao renovar token: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Refresh token inválido ou expirado"));
        }
    }
    
    /**
     * Realiza logout invalidando o token atual
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request
    ) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                authService.logout(userDetails.getUsername(), token);
            }
            
            return ResponseEntity.ok(ApiResponse.success("Logout realizado com sucesso"));
            
        } catch (Exception e) {
            log.error("Erro ao realizar logout: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao realizar logout"));
        }
    }
    
    /**
     * Retorna informações do usuário autenticado
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = (User) userDetails;
            
            List<String> roles = user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();
            
            Map<String, Object> userInfo = Map.of(
                    "email", user.getEmail(),
                    "name", user.getName() != null ? user.getName() : "",
                    "roles", roles,
                    "enabled", user.isEnabled(),
                    "lastLoginAt", user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : ""
            );
            
            return ResponseEntity.ok(ApiResponse.success("Usuário autenticado", userInfo));
            
        } catch (Exception e) {
            log.error("Erro ao buscar usuário atual: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erro ao buscar informações do usuário"));
        }
    }
    
    /**
     * Valida se o token JWT é válido
     */
    @GetMapping("/validate")
    public ResponseEntity<ApiResponse> validateToken(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok(ApiResponse.success("Token válido"));
        }
        
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Token inválido ou expirado"));
    }
    
    /**
     * Endpoint protegido - apenas para teste de autorização
     * Requer role ADMIN
     */
    @GetMapping("/admin/test")
    public ResponseEntity<ApiResponse> adminTest(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                ApiResponse.success("Acesso autorizado para admin", 
                        Map.of("user", userDetails.getUsername()))
        );
    }
}
