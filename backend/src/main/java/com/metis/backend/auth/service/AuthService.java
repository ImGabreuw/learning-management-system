package com.metis.backend.auth.service;

import com.metis.backend.auth.dto.UserDto;
import com.metis.backend.auth.dto.request.LoginRequest;
import com.metis.backend.auth.response.AuthResponse;
import com.metis.backend.auth.model.User;
import com.metis.backend.auth.repository.UserRepository;
import com.metis.backend.auth.security.UserPrincipal;
import com.metis.backend.auth.security.jwt.JwtTokenProvider;
import com.metis.backend.auth.exception.InvalidEmailException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationMs;

    public AuthResponse authenticate(LoginRequest loginRequest) {
        try {
            // Validação do email mackenzista
            validarEmailMackenzie(loginRequest.getEmail());

            // Autenticação com Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            // Atualiza último login
            atualizarUltimoLogin(userPrincipal.getId());

            // Gera token JWT
            String jwt = jwtTokenProvider.generateToken(userPrincipal);

            // Busca dados completos do usuário
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new BadCredentialsException("Usuário não encontrado"));

            UserDto userDto = UserDto.fromUser(user);

            logger.info("Usuário autenticado com sucesso: {}", loginRequest.getEmail());

            return new AuthResponse(jwt, (long) jwtExpirationMs, userDto);

        } catch (AuthenticationException e) {
            logger.error("Erro de autenticação para email: {}", loginRequest.getEmail());
            throw new BadCredentialsException("Email ou senha incorretos");
        }
    }

    public void performLogout(String token) {
        try {
            if (jwtTokenProvider.validarToken(token)) {
                // Adiciona token à blacklist até a data de expiração
                tokenBlacklistService.adicionarTokenNaBlacklist(token,
                        jwtTokenProvider.getTokenExpiration(token));

                String username = jwtTokenProvider.obterNomeUsuarioDoToken(token);
                logger.info("Logout realizado com sucesso para usuário: {}", username);
            }
        } catch (Exception e) {
            logger.error("Erro durante o logout: {}", e.getMessage());
            throw new RuntimeException("Erro durante o logout", e);
        }
    }

    private void validarEmailMackenzie(String email) {
        if (email == null || !email.endsWith("@mackenzie.br")) {
            throw new InvalidEmailException("Email deve ser do domínio @mackenzie.br");
        }
    }

    private void atualizarUltimoLogin(String userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setLastLogin(LocalDateTime.now());
                userRepository.save(user);
            }
        } catch (Exception e) {
            logger.warn("Erro ao atualizar último login do usuário {}: {}", userId, e.getMessage());
            // Não propaga o erro para não interromper o login
        }
    }

    public boolean validarCredenciais(String email, String password) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);
            return user != null && passwordEncoder.matches(password, user.getPassword());
        } catch (Exception e) {
            logger.error("Erro ao validar credenciais: {}", e.getMessage());
            return false;
        }
    }
}