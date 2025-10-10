package br.mackenzie.auth.security;

import br.mackenzie.auth.service.JwtService;
import br.mackenzie.auth.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro JWT que intercepta cada requisição e valida o token
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final UserService userService;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        // Verifica se o header Authorization existe e começa com "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            // Extrai o token
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);
            
            // Se o email foi extraído e não há autenticação no contexto
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userService.loadUserByUsername(userEmail);
                
                // Valida o token
                if (jwtService.validateToken(jwt, userDetails)) {
                    // Verifica se o token não foi invalidado (logout)
                    if (!userService.isTokenInvalidated(userEmail, jwt)) {
                        // Cria autenticação
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                        
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        
                        log.debug("Usuário autenticado: {}", userEmail);
                    } else {
                        log.warn("Token invalidado (logout) para usuário: {}", userEmail);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Erro ao processar token JWT: {}", e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
}
