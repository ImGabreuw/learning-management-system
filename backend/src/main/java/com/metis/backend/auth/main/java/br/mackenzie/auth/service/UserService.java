package br.mackenzie.auth.service;

import br.mackenzie.auth.model.Role;
import br.mackenzie.auth.model.User;
import br.mackenzie.auth.repository.RoleRepository;
import br.mackenzie.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Serviço responsável pelo gerenciamento de usuários
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Value("${mackenzie.allowed-email-domains}")
    private List<String> allowedEmailDomains;

    @Value("${mackenzie.default-roles}")
    private List<String> defaultRoles;

    @Value("${mackenzie.admin-emails}")
    private List<String> adminEmails;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }

    /**
     * Valida se o email pertence aos domínios permitidos do Mackenzie
     */
    public boolean isValidMackenzieEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }

        String emailLower = email.toLowerCase();
        return allowedEmailDomains.stream()
                .anyMatch(domain -> emailLower.endsWith("@" + domain));
    }

    /**
     * Cria ou atualiza um usuário após autenticação OAuth2
     */
    public User createOrUpdateUser(String email, String name, String microsoftId) {
        // Valida se o email é do Mackenzie
        if (!isValidMackenzieEmail(email)) {
            throw new IllegalArgumentException("Email não pertence aos domínios permitidos do Mackenzie");
        }

        // Busca usuário existente ou cria novo
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    log.info("Criando novo usuário: {}", email);
                    return User.builder()
                            .email(email)
                            .createdAt(LocalDateTime.now())
                            .accountNonExpired(true)
                            .accountNonLocked(true)
                            .credentialsNonExpired(true)
                            .enabled(true)
                            .invalidatedTokens(new HashSet<>())
                            .build();
                });

        // Atualiza informações
        user.setName(name);
        user.setMicrosoftId(microsoftId);
        user.setLastLoginAt(LocalDateTime.now());

        // Atribui roles
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Set<Role> roles = assignRoles(email);
            user.setRoles(roles);
        }

        return userRepository.save(user);
    }

    /**
     * Atribui roles ao usuário baseado em regras de negócio
     */
    private Set<Role> assignRoles(String email) {
        Set<Role> roles = new HashSet<>();

        // Adiciona roles padrão
        for (String roleName : defaultRoles) {
            Role role = roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.save(new Role(roleName)));
            roles.add(role);
        }

        // Verifica se é admin
        if (adminEmails.contains(email.toLowerCase())) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setName("ROLE_ADMIN");
                        newRole.setDescription("Administrador do sistema");
                        return roleRepository.save(newRole);
                    });
            roles.add(adminRole);
        }

        return roles;
    }

    /**
     * Invalida um token para logout
     */
    public void invalidateToken(String email, String token) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.invalidateToken(token);
            userRepository.save(user);
            log.info("Token invalidado para usuário: {}", email);
        });
    }

    /**
     * Verifica se um token foi invalidado
     */
    public boolean isTokenInvalidated(String email, String token) {
        return userRepository.findByEmail(email)
                .map(user -> user.isTokenInvalidated(token))
                .orElse(false);
    }

    /**
     * Atualiza o IP do último login
     */
    public void updateLastLoginIp(String email, String ipAddress) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setLastLoginIp(ipAddress);
            userRepository.save(user);
        });
    }
}
