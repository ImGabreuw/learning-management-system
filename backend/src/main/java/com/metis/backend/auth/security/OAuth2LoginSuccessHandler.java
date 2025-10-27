package com.metis.backend.auth.security;

import com.metis.backend.auth.models.response.OAuth2LoginResponse;
import com.metis.backend.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

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
    ) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        try {
            OAuth2LoginResponse tokens = authService.processOAuth2Login(oAuth2User, request);
            String redirectUrl = buildRedirectUrl(tokens);
            String email = oAuth2User.getAttribute("email");

            log.info("Successful OAuth2 login for user ({}), redirecting to {}", email, redirectUrl);
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } catch (Exception e) {
            log.error("Error processing OAuth2 login: {}", e.getMessage());
            response.sendRedirect("/api/v1/auth/login?error=oauth2_processing_failed");
        }
    }

    private String buildRedirectUrl(OAuth2LoginResponse tokens) {
        return String.format(
                "/api/auth/oauth2/success?accessToken=%s&refreshToken=%s&tokenType=%s",
                tokens.getAccessToken(),
                tokens.getRefreshToken(),
                tokens.getTokenType()
        );
    }

}
