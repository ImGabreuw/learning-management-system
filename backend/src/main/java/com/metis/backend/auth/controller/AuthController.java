package com.metis.backend.auth.controller;

import com.metis.backend.auth.dto.request.LoginRequest;
import com.metis.backend.auth.response.AuthResponse;
import com.metis.backend.auth.response.MessageResponse;
import com.metis.backend.auth.service.AuthService;
import com.metis.backend.auth.service.OAuth2AuthenticationService;
import com.metis.backend.auth.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private OAuth2AuthenticationService oauth2AuthService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * AUTH-RF1: Autenticação via email mackenzista e senha
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.authenticate(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            logger.error("Erro no login: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Email ou senha incorretos"));
        }
    }

    /**
     * AUTH-RF2: Logout do sistema
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            String token = extrairTokenDoHeader(request);

            if (!StringUtils.hasText(token)) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Token obrigatório"));
            }

            // Validação do token
            if (!jwtTokenProvider.validarToken(token)) {
                // Mesmo com token inválido, retorna sucesso (boa prática)
                return ResponseEntity.ok(new MessageResponse("Logout realizado"));
            }

            // Realiza logout (adiciona à blacklist)
            authService.performLogout(token);

            return ResponseEntity.ok(new MessageResponse("Logout realizado com sucesso"));

        } catch (Exception e) {
            logger.error("Erro durante logout: {}", e.getMessage());
            return ResponseEntity.ok(new MessageResponse("Logout realizado"));
        }
    }

    /**
     * Endpoint para login OAuth2 com Microsoft
     */
    @PostMapping("/oauth2/success")
    public ResponseEntity<?> oauth2Success(@AuthenticationPrincipal OAuth2User principal) {
        try {
            AuthResponse authResponse = oauth2AuthService.processOAuth2Login(principal);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            logger.error("Erro no login OAuth2: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Erro na autenticação com Microsoft"));
        }
    }

    /**
     * Endpoint para validação de token
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        try {
            String token = extrairTokenDoHeader(request);

            if (!StringUtils.hasText(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("Token não fornecido"));
            }

            boolean isValid = jwtTokenProvider.validarToken(token);

            if (isValid) {
                String username = jwtTokenProvider.obterNomeUsuarioDoToken(token);
                return ResponseEntity.ok(new MessageResponse("Token válido para usuário: " + username));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("Token inválido"));
            }

        } catch (Exception e) {
            logger.error("Erro na validação do token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Token inválido"));
        }
    }

    private String extrairTokenDoHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}