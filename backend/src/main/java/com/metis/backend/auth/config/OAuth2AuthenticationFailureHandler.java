package com.metis.backend.auth.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception
    ) throws IOException, ServletException {
        
        log.error("=".repeat(80));
        log.error("❌ FALHA NA AUTENTICAÇÃO OAuth2");
        log.error("=".repeat(80));
        log.error("Exception Type: {}", exception.getClass().getName());
        log.error("Error Message: {}", exception.getMessage());
        
        if (exception instanceof OAuth2AuthenticationException oauth2Exception) {
            log.error("OAuth2 Error Code: {}", oauth2Exception.getError().getErrorCode());
            log.error("OAuth2 Error Description: {}", oauth2Exception.getError().getDescription());
            log.error("OAuth2 Error URI: {}", oauth2Exception.getError().getUri());
        }
        
        log.error("Request URI: {}", request.getRequestURI());
        log.error("Request URL: {}", request.getRequestURL());
        log.error("Query String: {}", request.getQueryString());
        log.error("=".repeat(80));
        
        if (exception.getCause() != null) {
            log.error("Root Cause:", exception.getCause());
        } else {
            log.error("Exception:", exception);
        }
        
        log.error("=".repeat(80));
        
        // Redireciona para o frontend com erro
        String errorUrl = "http://localhost:3000/login?error=oauth2_failed&message=" + 
                          exception.getMessage().replace(" ", "_");
        getRedirectStrategy().sendRedirect(request, response, errorUrl);
    }
}
