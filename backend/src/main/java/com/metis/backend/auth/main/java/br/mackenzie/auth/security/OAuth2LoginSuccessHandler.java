package br.mackenzie.auth.security;

import br.mackenzie.auth.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

/**
 * Handler executado após login OAuth2 bem-sucedido
 * Gera tokens JWT e redireciona com os tokens
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private final AuthService authService;
    
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        try {
            // Processa login e gera tokens
            Map<String, String> tokens = authService.processOAuth2Login(oAuth2User, request);
            
            // Monta URL de redirecionamento com tokens
            String redirectUrl = buildRedirectUrl(tokens);
            
            log.info("Login OAuth2 bem-sucedido, redirecionando para: {}", redirectUrl);
            
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
            
        } catch (Exception e) {
            log.error("Erro ao processar login OAuth2: {}", e.getMessage(), e);
            response.sendRedirect("/api/v1/auth/login?error=oauth2_processing_failed");
        }
    }
    
    /**
     * Constrói URL de redirecionamento com os tokens
     * Em produção, você pode redirecionar para o frontend da aplicação
     */
    private String buildRedirectUrl(Map<String, String> tokens) {
        return String.format(
                "/api/v1/auth/oauth2/success?accessToken=%s&refreshToken=%s&tokenType=%s",
                tokens.get("accessToken"),
                tokens.get("refreshToken"),
                tokens.get("tokenType")
        );
    }
}
