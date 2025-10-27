package com.metis.backend.auth.service;

import com.metis.backend.config.MetisProperties;
import com.metis.backend.auth.models.entities.RoleEntity;
import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.auth.repository.RoleRepository;
import com.metis.backend.auth.repository.UserRepository;
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
    private final RoleRepository roleRepository;
    private final MetisProperties metisProperties;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public boolean isValidMackenzieEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }

        String emailLower = email.toLowerCase();
        List<String> allowedEmailDomains = metisProperties.getAuth().getAllowedEmailDomains();
        if (allowedEmailDomains == null || allowedEmailDomains.isEmpty()) return false;
        return allowedEmailDomains.stream()
                .anyMatch(domain -> emailLower.endsWith("@" + domain));
    }

    public UserEntity createOrUpdateUser(String email, String name, String microsoftId) {
        if (!isValidMackenzieEmail(email)) {
            throw new IllegalArgumentException("Email does not belong to allowed Mackenzie domains");
        }

        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    log.info("Creating new user: {}", email);
                    return UserEntity.builder()
                            .email(email)
                            .createdAt(LocalDateTime.now())
                            .accountNonExpired(true)
                            .accountNonLocked(true)
                            .credentialsNonExpired(true)
                            .enabled(true)
                            .invalidatedTokens(new HashSet<>())
                            .build();
                });

        userEntity.setName(name);
        userEntity.setMicrosoftId(microsoftId);
        userEntity.setLastLoginAt(LocalDateTime.now());

        if (userEntity.getRoleEntities() == null || userEntity.getRoleEntities().isEmpty()) {
            Set<RoleEntity> roleEntities = assignRoles(email);
            userEntity.setRoleEntities(roleEntities);
        }

        return userRepository.save(userEntity);
    }

    private Set<RoleEntity> assignRoles(String email) {
        Set<RoleEntity> roleEntities = new HashSet<>();

        List<String> defaultRoles = metisProperties.getAuth().getDefaultRoles();
        for (String roleName : defaultRoles) {
            RoleEntity roleEntity = roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.save(new RoleEntity(roleName)));
            roleEntities.add(roleEntity);
        }

        List<String> adminEmails = metisProperties.getAuth().getAdminEmails();
        if (adminEmails.contains(email.toLowerCase())) {
            RoleEntity adminRoleEntity = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> {
                        RoleEntity newRoleEntity = new RoleEntity();
                        newRoleEntity.setName("ROLE_ADMIN");
                        newRoleEntity.setDescription("System administrator");
                        return roleRepository.save(newRoleEntity);
                    });
            roleEntities.add(adminRoleEntity);
        }

        return roleEntities;
    }

    public void invalidateToken(String email, String token) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.invalidateToken(token);
            userRepository.save(user);
            log.info("Token invalidated for user: {}", email);
        });
    }

    public boolean isTokenInvalidated(String email, String token) {
        return userRepository.findByEmail(email)
                .map(user -> user.isTokenInvalidated(token))
                .orElse(false);
    }

    public void updateLastLoginIp(String email, String ipAddress) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setLastLoginIp(ipAddress);
            userRepository.save(user);
        });
    }
}
