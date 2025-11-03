package com.metis.backend.auth.config;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.auth.service.AuthService;
import com.metis.backend.auth.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;
    private final AuthService authService;

    @Value("${custom.oauth2.frontend-callback-url:http://localhost:3000/auth/callback}")
    private String frontendCallbackUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        
        log.info("🎉 OAuth2 authentication callback received!");
        log.info("Authentication type: {}", authentication.getClass().getName());
        log.info("Principal type: {}", authentication.getPrincipal().getClass().getName());
        
        if (authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            try {
                // Log todos os atributos do usuário
                log.info("📋 OAuth2 User Attributes:");
                oauth2User.getAttributes().forEach((key, value) -> 
                    log.info("  - {}: {}", key, value)
                );
                
                // Extrai informações do usuário do Microsoft Graph
                // Pega do map de atributos (case-sensitive!)
                Map<String, Object> attributes = oauth2User.getAttributes();
                
                String email = (String) attributes.get("email");
                if (email == null || email.isEmpty()) {
                    email = (String) attributes.get("mail");
                }
                if (email == null || email.isEmpty()) {
                    email = (String) attributes.get("userPrincipalName");
                }
                if (email == null || email.isEmpty()) {
                    email = (String) attributes.get("preferred_username");
                }
                
                String name = (String) attributes.get("name");
                if (name == null || name.isEmpty()) {
                    name = (String) attributes.get("displayName");
                }
                if (name == null || name.isEmpty()) {
                    name = (String) attributes.get("givenname");
                }
                
                String microsoftId = (String) attributes.get("sub");
                if (microsoftId == null) {
                    microsoftId = (String) attributes.get("oid");
                }
                if (microsoftId == null) {
                    microsoftId = (String) attributes.get("id");
                }
                
                log.info("📧 Email extracted: {}", email);
                log.info("👤 Name extracted: {}", name);
                log.info("🆔 Microsoft ID extracted: {}", microsoftId);
                
                if (email == null || email.isEmpty()) {
                    log.error("❌ Email is null or empty after trying all attributes!");
                    log.error("❌ Available attributes: {}", oauth2User.getAttributes().keySet());
                    throw new IllegalArgumentException("Email não encontrado na resposta do Microsoft. Atributos disponíveis: " + oauth2User.getAttributes().keySet());
                }
                
                log.info("OAuth2 authentication successful for user: {}", email);
                
                // Cria ou atualiza o usuário no banco de dados
                log.info("🔄 Creating or updating user in database...");
                UserEntity user = userService.createOrUpdateUser(email, name, microsoftId);
                log.info("✅ User created/updated: {}", user.getEmail());
                
                // Gera tokens JWT
                log.info("🔑 Generating JWT tokens...");
                AuthService.TokenPair tokens = authService.generateTokensForUser(user);
                log.info("✅ Tokens generated successfully");
                
                // Constrói a URL de redirecionamento com os tokens
                String redirectUrl = UriComponentsBuilder.fromUriString(frontendCallbackUrl)
                        .queryParam("accessToken", tokens.accessToken())
                        .queryParam("refreshToken", tokens.refreshToken())
                        .queryParam("tokenType", "Bearer")
                        .build()
                        .toUriString();
                
                log.info("🚀 Redirecting to frontend: {}", redirectUrl.substring(0, Math.min(100, redirectUrl.length())) + "...");
                
                // Redireciona para o frontend com os tokens
                getRedirectStrategy().sendRedirect(request, response, redirectUrl);
                
            } catch (IllegalArgumentException e) {
                log.error("❌ Email domain not allowed: {}", e.getMessage(), e);
                String errorUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login")
                        .queryParam("error", "domain_not_allowed")
                        .queryParam("message", e.getMessage())
                        .build()
                        .toUriString();
                log.info("🔄 Redirecting to error page: {}", errorUrl);
                getRedirectStrategy().sendRedirect(request, response, errorUrl);
            } catch (Exception e) {
                log.error("❌ ERRO CRÍTICO durante autenticação OAuth2:", e);
                log.error("   Tipo: {}", e.getClass().getName());
                log.error("   Mensagem: {}", e.getMessage());
                log.error("   Stack trace:", e);
                String errorUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login")
                        .queryParam("error", "authentication_failed")
                        .queryParam("message", e.getMessage())
                        .build()
                        .toUriString();
                log.info("🔄 Redirecting to error page: {}", errorUrl);
                getRedirectStrategy().sendRedirect(request, response, errorUrl);
            }
        } else {
            log.error("❌ Authentication principal is not OAuth2User: {}", 
                authentication.getPrincipal().getClass().getName());
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }
}
