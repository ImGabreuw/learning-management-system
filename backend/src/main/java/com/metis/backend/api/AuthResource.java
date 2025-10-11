package com.metis.backend.api;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.auth.models.requests.RefreshTokenRequest;
import com.metis.backend.auth.models.response.AdminTestResponse;
import com.metis.backend.auth.models.response.AuthResponse;
import com.metis.backend.auth.models.response.CurrentUserResponse;
import com.metis.backend.auth.models.response.LoginUrlResponse;
import com.metis.backend.auth.models.response.RefreshTokenResponse;
import com.metis.backend.auth.service.AuthService;
import com.metis.backend.auth.service.JwtService;
import com.metis.backend.auth.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthResource {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;

    @GetMapping("/login")
    public ResponseEntity<LoginUrlResponse> login() {
        LoginUrlResponse data = LoginUrlResponse.builder()
                .loginUrl("/oauth2/authorization/microsoft")
                .build();
        log.debug("Login URL requested");
        return ResponseEntity.ok(data);
    }

    @GetMapping("/oauth2/success")
    public ResponseEntity<AuthResponse> oauth2Success(
            @RequestParam String accessToken,
            @RequestParam String refreshToken,
            @RequestParam String tokenType
    ) {
        String email = jwtService.extractUsername(accessToken);
        UserEntity userEntity = (UserEntity) userService.loadUserByUsername(email);

        List<String> roles = userEntity.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        AuthResponse response = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(tokenType)
                .expiresIn(86400L)
                .userInfo(AuthResponse.UserInfo.builder()
                        .email(userEntity.getEmail())
                        .name(userEntity.getName())
                        .roles(roles)
                        .build())
                .build();

        log.info("OAuth2 success for user: {}", email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshTokenResponse tokens = authService.refreshToken(request.getRefreshToken());
        log.info("Refresh token used to generate new access token for user: {}", jwtService.extractUsername(request.getRefreshToken()));
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request
    ) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authService.logout(userDetails.getUsername(), token);
            log.info("User {} logged out", userDetails.getUsername());
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserEntity userEntity = (UserEntity) userDetails;

        List<String> roles = userEntity.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        CurrentUserResponse userInfo = CurrentUserResponse.builder()
                .email(userEntity.getEmail())
                .name(userEntity.getName())
                .roles(roles)
                .enabled(userEntity.isEnabled())
                .lastLoginAt(userEntity.getLastLoginAt() != null ? userEntity.getLastLoginAt().toString() : null)
                .build();

        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/validate")
    public ResponseEntity<Void> validateToken(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/test")
    public ResponseEntity<AdminTestResponse> adminTest(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        AdminTestResponse resp = AdminTestResponse.builder().user(username).build();
        return ResponseEntity.ok(resp);
    }

}
