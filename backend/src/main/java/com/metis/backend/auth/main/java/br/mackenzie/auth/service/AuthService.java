package br.mackenzie.auth.service;

import br.mackenzie.auth.model.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Serviço responsável pela lógica de autenticação
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserService userService;
    private final JwtService jwtService;
    
    /**
     * Processa login via OAuth2 Microsoft e gera tokens JWT
     */
    public Map<String, String> processOAuth2Login(OAuth2User oAuth2User, HttpServletRequest request) {
        // Extrai informações do OAuth2User
        String email = oAuth2User.getAttribute("userPrincipalName");
        String name = oAuth2User.getAttribute("displayName");
        String microsoftId = oAuth2User.getAttribute("id");
        
        if (email == null || email.isBlank()) {
            email = oAuth2User.getAttribute("mail");
        }
        
        log.info("Processando login OAuth2 para: {}", email);
        
        // Valida email do Mackenzie
        if (!userService.isValidMackenzieEmail(email)) {
            throw new IllegalArgumentException("Email não pertence aos domínios permitidos do Mackenzie");
        }
        
        // Cria ou atualiza usuário
        User user = userService.createOrUpdateUser(email, name, microsoftId);
        
        // Atualiza IP do último login
        String ipAddress = getClientIpAddress(request);
        userService.updateLastLoginIp(email, ipAddress);
        
        // Gera tokens JWT
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        log.info("Login bem-sucedido para: {}", email);
        
        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken,
                "tokenType", "Bearer",
                "expiresIn", "86400"
        );
    }
    
    /**
     * Realiza logout invalidando o token
     */
    public void logout(String email, String token) {
        log.info("Processando logout para: {}", email);
        userService.invalidateToken(email, token);
    }
    
    /**
     * Valida se um token é válido e não foi invalidado
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        if (!jwtService.validateToken(token, userDetails)) {
            return false;
        }
        
        String email = userDetails.getUsername();
        return !userService.isTokenInvalidated(email, token);
    }
    
    /**
     * Renova o access token usando o refresh token
     */
    public Map<String, String> refreshToken(String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userService.loadUserByUsername(email);
        
        if (!jwtService.validateToken(refreshToken, userDetails)) {
            throw new IllegalArgumentException("Refresh token inválido ou expirado");
        }
        
        String newAccessToken = jwtService.generateToken(userDetails);
        
        log.info("Token renovado para: {}", email);
        
        return Map.of(
                "accessToken", newAccessToken,
                "tokenType", "Bearer",
                "expiresIn", "86400"
        );
    }
    
    /**
     * Extrai o endereço IP do cliente
     */
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
