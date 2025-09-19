package com.mackenzie.lms.service;

import com.mackenzie.lms.dto.UserDto;
import com.mackenzie.lms.dto.response.AuthResponse;
import com.mackenzie.lms.model.Role;
import com.mackenzie.lms.model.User;
import com.mackenzie.lms.repository.UserRepository;
import com.mackenzie.lms.security.UserPrincipal;
import com.mackenzie.lms.security.jwt.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
public class OAuth2AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private RoleService roleService;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationMs;

    public AuthResponse processOAuth2Login(OAuth2User oauth2User) {
        try {
            String email = oauth2User.getAttribute("email");
            String firstName = oauth2User.getAttribute("given_name");
            String lastName = oauth2User.getAttribute("family_name");

            // Validação do email mackenzista
            if (!isValidMackenzieEmail(email)) {
                throw new IllegalArgumentException("Email deve ser do domínio @mackenzie.br");
            }

            // Busca ou cria usuário
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> criarNovoUsuarioOAuth2(email, firstName, lastName));

            // Atualiza último login
            user.setLastLogin(LocalDateTime.now());
            user = userRepository.save(user);

            // Gera token JWT
            UserPrincipal userPrincipal = UserPrincipal.create(user);
            String jwt = jwtTokenProvider.generateToken(userPrincipal);

            UserDto userDto = UserDto.fromUser(user);

            logger.info("Login OAuth2 realizado com sucesso para: {}", email);

            return new AuthResponse(jwt, (long) jwtExpirationMs, userDto);

        } catch (Exception e) {
            logger.error("Erro durante autenticação OAuth2: {}", e.getMessage());
            throw new RuntimeException("Erro na autenticação com Microsoft", e);
        }
    }

    private User criarNovoUsuarioOAuth2(String email, String firstName, String lastName) {
        try {
            // Determina role baseado no domínio do email ou outras regras
            Set<Role> roles = determinarRolesUsuario(email);

            User novoUsuario = new User();
            novoUsuario.setEmail(email);
            novoUsuario.setFirstName(firstName != null ? firstName : "");
            novoUsuario.setLastName(lastName != null ? lastName : "");
            novoUsuario.setRoles(roles);
            novoUsuario.setEnabled(true);
            // Para OAuth2, não precisamos de senha local
            novoUsuario.setPassword(null);

            User savedUser = userRepository.save(novoUsuario);
            logger.info("Novo usuário OAuth2 criado: {}", email);

            return savedUser;

        } catch (Exception e) {
            logger.error("Erro ao criar usuário OAuth2: {}", e.getMessage());
            throw new RuntimeException("Erro ao criar usuário", e);
        }
    }

    private Set<Role> determinarRolesUsuario(String email) {
        // Lógica para determinar roles baseado no email ou outros critérios
        // Por exemplo, professores podem ter emails específicos, alunos outros padrões

        if (isEmailProfessor(email)) {
            return Set.of(roleService.findByName("PROFESSOR"));
        } else if (isEmailAdmin(email)) {
            return Set.of(roleService.findByName("ADMIN"));
        } else {
            // Default: aluno
            return Set.of(roleService.findByName("ALUNO"));
        }
    }

    private boolean isValidMackenzieEmail(String email) {
        return email != null && email.endsWith("@mackenzie.br");
    }

    private boolean isEmailProfessor(String email) {
        // Lógica para identificar professores
        // Pode ser baseado em padrões específicos do email ou consulta a sistema externo
        return email != null && email.contains(".professor@") || email.startsWith("prof.");
    }

    private boolean isEmailAdmin(String email) {
        // Lista de emails administrativos
        return email != null && (
                email.startsWith("admin@") ||
                        email.startsWith("coordenacao@") ||
                        email.startsWith("diretoria@")
        );
    }
}