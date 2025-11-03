package com.metis.backend.auth.service;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.auth.models.enums.Role;
import com.metis.backend.auth.repositories.UserRepository;
import com.metis.backend.config.MetisProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final MetisProperties metisProperties;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com email: " + email));
    }

    /**
     * Cria ou atualiza um usuário baseado nos dados do OAuth2
     */
    public UserEntity createOrUpdateUser(String email, String name, String microsoftId) {
        return userRepository.findByEmail(email)
                .map(existingUser -> updateExistingUser(existingUser, name, microsoftId))
                .orElseGet(() -> createNewUser(email, name, microsoftId));
    }

    /**
     * Atualiza dados de um usuário existente
     */
    private UserEntity updateExistingUser(UserEntity user, String name, String microsoftId) {
        user.setName(name);
        user.setMicrosoftId(microsoftId);
        user.setLastLoginAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        UserEntity saved = userRepository.save(user);
        log.info("Usuário atualizado: {}", saved.getEmail());
        return saved;
    }

    /**
     * Cria um novo usuário
     */
    private UserEntity createNewUser(String email, String name, String microsoftId) {
        validateEmailDomain(email);
        
        Set<Role> roles = new HashSet<>();
        roles.add(Role.ROLE_USER);
        
        // Determina se é estudante ou não baseado no domínio
        if (email.endsWith("@mackenzista.com.br")) {
            roles.add(Role.ROLE_STUDENT);
        }
        
        // Verifica se é admin
        List<String> adminEmails = metisProperties.getAuth().getAdminEmails();
        if (adminEmails != null && adminEmails.contains(email)) {
            roles.add(Role.ROLE_ADMIN);
        }
        
        UserEntity newUser = UserEntity.builder()
                .email(email)
                .name(name)
                .microsoftId(microsoftId)
                .roles(roles)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .lastLoginAt(LocalDateTime.now())
                .build();
        
        UserEntity saved = userRepository.save(newUser);
        log.info("Novo usuário criado: {} com roles: {}", saved.getEmail(), saved.getRoles());
        return saved;
    }

    /**
     * Valida se o domínio do email é permitido
     */
    private void validateEmailDomain(String email) {
        List<String> allowedDomains = metisProperties.getAuth().getAllowedEmailDomains();
        
        boolean isAllowed = allowedDomains.stream()
                .anyMatch(domain -> email.endsWith("@" + domain));
        
        if (!isAllowed) {
            String message = String.format(
                    "Email %s não está em um domínio permitido. Domínios permitidos: %s",
                    email,
                    String.join(", ", allowedDomains)
            );
            log.warn(message);
            throw new IllegalArgumentException(message);
        }
    }

    /**
     * Atualiza o último login do usuário
     */
    public void updateLastLogin(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
            log.debug("Último login atualizado para: {}", email);
        });
    }
}
