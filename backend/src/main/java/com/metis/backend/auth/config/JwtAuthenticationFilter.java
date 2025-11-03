package com.metis.backend.auth.config;

import com.metis.backend.auth.service.JwtService;
import com.metis.backend.auth.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Se não houver header Authorization ou não começar com "Bearer ", pula o filtro
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extrai o token JWT
        jwt = authHeader.substring(7);
        
        try {
            // Extrai o email do token
            userEmail = jwtService.extractUsername(jwt);

            // Se o email foi extraído e não há autenticação no contexto de segurança
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Carrega os detalhes do usuário
                UserDetails userDetails = userService.loadUserByUsername(userEmail);

                // Valida o token
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // Cria o objeto de autenticação
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    
                    // Adiciona detalhes da requisição
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Define a autenticação no contexto de segurança
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    log.debug("User {} authenticated successfully", userEmail);
                } else {
                    log.warn("Invalid JWT token for user: {}", userEmail);
                }
            }
        } catch (Exception e) {
            log.error("Error processing JWT token: {}", e.getMessage());
        }

        // Continua a cadeia de filtros
        filterChain.doFilter(request, response);
    }
}
