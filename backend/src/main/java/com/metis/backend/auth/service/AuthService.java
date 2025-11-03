package com.metis.backend.auth.service;

import com.metis.backend.auth.models.entities.TokenBlacklist;
import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.auth.models.response.RefreshTokenResponse;
import com.metis.backend.auth.repositories.TokenBlacklistRepository;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserService userService;
    private final TokenBlacklistRepository tokenBlacklistRepository;

    /**
     * Realiza o logout do usuário, adicionando o token à blacklist
     */
    public void logout(String email, String token) {
        try {
            TokenBlacklist blacklistedToken = TokenBlacklist.builder()
                    .token(token)
                    .userEmail(email)
                    .blacklistedAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusDays(1)) // Expira após 24h
                    .build();
            
            tokenBlacklistRepository.save(blacklistedToken);
            log.info("Token adicionado à blacklist para o usuário: {}", email);
        } catch (Exception e) {
            log.error("Erro ao adicionar token à blacklist: {}", e.getMessage());
            throw new RuntimeException("Erro ao realizar logout", e);
        }
    }

    /**
     * Renova os tokens usando um refresh token válido
     */
    public RefreshTokenResponse refreshToken(String refreshToken) {
        try {
            // Valida o refresh token
            if (!jwtService.validateToken(refreshToken)) {
                throw new IllegalArgumentException("Refresh token inválido ou expirado");
            }

            // Extrai o email do refresh token
            String email = jwtService.extractUsername(refreshToken);
            
            // Carrega o usuário
            UserDetails userDetails = userService.loadUserByUsername(email);
            
            // Valida se o token pertence ao usuário
            if (!jwtService.isTokenValid(refreshToken, userDetails)) {
                throw new IllegalArgumentException("Refresh token não pertence ao usuário");
            }
            
            // Gera novos tokens
            String newAccessToken = jwtService.generateAccessToken(userDetails);
            String newRefreshToken = jwtService.generateRefreshToken(userDetails);
            
            // Adiciona o refresh token antigo à blacklist
            TokenBlacklist blacklistedToken = TokenBlacklist.builder()
                    .token(refreshToken)
                    .userEmail(email)
                    .blacklistedAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusDays(7)) // Expira após 7 dias
                    .build();
            tokenBlacklistRepository.save(blacklistedToken);
            
            log.info("Tokens renovados para o usuário: {}", email);
            
            return RefreshTokenResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .expiresIn(86400L) // 24 horas em segundos
                    .build();
                    
        } catch (ExpiredJwtException e) {
            log.error("Refresh token expirado: {}", e.getMessage());
            throw new IllegalArgumentException("Refresh token expirado");
        } catch (Exception e) {
            log.error("Erro ao renovar tokens: {}", e.getMessage());
            throw new RuntimeException("Erro ao renovar tokens", e);
        }
    }

    /**
     * Gera tokens JWT para um usuário OAuth2 autenticado
     */
    public TokenPair generateTokensForUser(UserEntity user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        log.info("Tokens gerados para o usuário: {}", user.getEmail());
        
        return new TokenPair(accessToken, refreshToken);
    }

    /**
     * Record para armazenar o par de tokens
     */
    public record TokenPair(String accessToken, String refreshToken) {}
}
