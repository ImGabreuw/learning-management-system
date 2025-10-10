package br.mackenzie.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidade que representa um usuário autenticado via Microsoft/Outlook
 * Implementa UserDetails para integração com Spring Security
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User implements UserDetails {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email; // Email institucional (@mackenzie.br ou @mackenzista.com.br)
    
    private String name;
    
    private String microsoftId; // ID do usuário no Azure AD
    
    @DBRef
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
    
    private boolean accountNonExpired;
    
    private boolean accountNonLocked;
    
    private boolean credentialsNonExpired;
    
    private boolean enabled;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime lastLoginAt;
    
    private String lastLoginIp;
    
    // Tokens para invalidação de logout
    @Builder.Default
    private Set<String> invalidatedTokens = new HashSet<>();
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }
    
    @Override
    public String getPassword() {
        // OAuth2 não usa senha, retorna null
        return null;
    }
    
    @Override
    public String getUsername() {
        return email;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled;
    }
    
    /**
     * Adiciona um token à lista de tokens invalidados (para logout)
     */
    public void invalidateToken(String token) {
        this.invalidatedTokens.add(token);
    }
    
    /**
     * Verifica se um token foi invalidado
     */
    public boolean isTokenInvalidated(String token) {
        return this.invalidatedTokens.contains(token);
    }
}
