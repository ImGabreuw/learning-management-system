package com.metis.backend.auth.service;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.auth.models.response.OAuth2LoginResponse;
import com.metis.backend.auth.models.response.RefreshTokenResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final JwtService jwtService;

    public OAuth2LoginResponse processOAuth2Login(OAuth2User oAuth2User, HttpServletRequest request) {
        // --- INÍCIO DA CORREÇÃO ---
        // Tenta buscar o e-mail por ordem de prioridade
        String email = oAuth2User.getAttribute("email"); // 1. Contas pessoais (@outlook.com)
        
        if (email == null || email.isBlank()) {
            email = oAuth2User.getAttribute("userPrincipalName"); // 2. Contas organizacionais (@mackenzie.br)
        }

        if (email == null || email.isBlank()) {
            email = oAuth2User.getAttribute("mail"); // 3. Fallback
        }
        
        String name = oAuth2User.getAttribute("displayName");
        String microsoftId = oAuth2User.getAttribute("id");
        // --- FIM DA CORREÇÃO ---

        log.info("Processing OAuth2 login for: {}", email);

        if (email == null || email.isBlank()) {
             throw new IllegalArgumentException("Não foi possível extrair um e-mail válido da resposta do OAuth2.");
        }

        if (!userService.isValidMackenzieEmail(email)) {
            // Esta verificação agora vai bloquear contas pessoais se "outlook.com" não estiver na lista.
            // Se você quiser permitir contas pessoais, adicione "outlook.com" na lista
            // 'allowed-email-domains' no seu 'application-dev.yaml'.
            // Pelo seu log, sua conta é pessoal, então certifique-se de que está lá.
            log.warn("Tentativa de login com e-mail não permitido: {}", email);
            throw new IllegalArgumentException("E-mail não pertence a um domínio permitido.");
        }

        UserEntity userEntity = userService.createOrUpdateUser(email, name, microsoftId);

        String ipAddress = getClientIpAddress(request);
        userService.updateLastLoginIp(email, ipAddress);

        String accessToken = jwtService.generateToken(userEntity);
        String refreshToken = jwtService.generateRefreshToken(userEntity);

        log.info("Successful login for: {}", email);

        return OAuth2LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .build();
    }

    public void logout(String email, String token) {
        log.info("Processing logout for: {}", email);
        userService.invalidateToken(email, token);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        if (!jwtService.validateToken(token, userDetails)) {
            return false;
        }

        String email = userDetails.getUsername();
        return !userService.isTokenInvalidated(email, token);
    }

    public RefreshTokenResponse refreshToken(String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userService.loadUserByUsername(email);

        if (!jwtService.validateToken(refreshToken, userDetails)) {
            throw new IllegalArgumentException("Refresh token is invalid or expired");
        }

        String newAccessToken = jwtService.generateToken(userDetails);
        log.info("Token refreshed for: {}", email);

        return RefreshTokenResponse
                .builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .build();
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}