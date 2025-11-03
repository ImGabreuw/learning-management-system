package com.metis.backend.auth.service;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.auth.repositories.TokenBlacklistRepository;
import com.metis.backend.config.MetisProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    private final MetisProperties metisProperties;
    private final TokenBlacklistRepository tokenBlacklistRepository;

    /**
     * Extrai o username (email) do token JWT
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrai uma claim específica do token
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Gera um token de acesso para o usuário
     */
    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> extraClaims = new HashMap<>();
        
        if (userDetails instanceof UserEntity user) {
            extraClaims.put("name", user.getName());
            extraClaims.put("roles", user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()));
        }
        
        return generateToken(extraClaims, userDetails, metisProperties.getJwt().getExpiration());
    }

    /**
     * Gera um refresh token para o usuário
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails, metisProperties.getJwt().getRefreshExpiration());
    }

    /**
     * Gera um token JWT com claims customizadas
     */
    private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Valida se o token é válido para o usuário
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        boolean isBlacklisted = tokenBlacklistRepository.existsByToken(token);
        
        return (username.equals(userDetails.getUsername())) 
                && !isTokenExpired(token) 
                && !isBlacklisted;
    }

    /**
     * Verifica se o token expirou
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extrai a data de expiração do token
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrai todas as claims do token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Obtém a chave de assinatura do JWT
     */
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(metisProperties.getJwt().getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Verifica se um token é válido (não expirado e não na blacklist)
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token);
            
            return !tokenBlacklistRepository.existsByToken(token);
        } catch (MalformedJwtException e) {
            log.error("Token JWT inválido: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("Token JWT expirado: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Token JWT não suportado: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("Claims do JWT vazio: {}", e.getMessage());
        }
        return false;
    }
}
