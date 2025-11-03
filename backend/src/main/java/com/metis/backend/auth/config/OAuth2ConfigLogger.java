package com.metis.backend.auth.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class OAuth2ConfigLogger {

    @Value("${spring.security.oauth2.client.registration.microsoft.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.microsoft.client-secret:NOT_SET}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.microsoft.redirect-uri}")
    private String redirectUri;

    @Value("${spring.security.oauth2.client.provider.microsoft.authorization-uri}")
    private String authorizationUri;

    @Value("${spring.security.oauth2.client.provider.microsoft.token-uri}")
    private String tokenUri;

    @Value("${custom.oauth2.frontend-callback-url:http://localhost:3000/auth/callback}")
    private String frontendCallbackUrl;

    @PostConstruct
    public void logOAuth2Config() {
        log.info("=".repeat(80));
        log.info("🔐 CONFIGURAÇÃO OAUTH2 - MICROSOFT");
        log.info("=".repeat(80));
        log.info("✅ Client ID: {}", clientId);
        log.info("✅ Client Secret: {}... (length: {})", 
            clientSecret != null && !clientSecret.equals("NOT_SET") && clientSecret.length() > 10 
                ? clientSecret.substring(0, 10) : "NOT_SET",
            clientSecret != null ? clientSecret.length() : 0);
        log.info("✅ Redirect URI (Spring Security): {}", redirectUri);
        log.info("✅ Authorization URI: {}", authorizationUri);
        log.info("✅ Token URI: {}", tokenUri);
        log.info("✅ Frontend Callback URL: {}", frontendCallbackUrl);
        log.info("=".repeat(80));
        log.info("🚀 IMPORTANTE: O redirect URI do Azure Portal DEVE ser:");
        log.info("   http://localhost:8080/login/oauth2/code/microsoft");
        log.info("=".repeat(80));
        
        // Validações
        if (clientSecret == null || clientSecret.equals("NOT_SET") || clientSecret.length() < 20) {
            log.error("❌ CLIENT SECRET INVÁLIDO! Verifique a variável AZURE_CLIENT_SECRET no .env");
        }
        
        if (!redirectUri.contains("/login/oauth2/code/microsoft")) {
            log.error("❌ REDIRECT URI INCORRETO! Deve conter '/login/oauth2/code/microsoft'");
        }
        
        if (!authorizationUri.contains("/common/")) {
            log.warn("⚠️  Authorization URI não usa '/common/' - pode não funcionar com contas pessoais Microsoft");
        }
    }
}
