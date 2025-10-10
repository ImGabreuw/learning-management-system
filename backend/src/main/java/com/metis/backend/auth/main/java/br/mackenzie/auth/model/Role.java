package br.mackenzie.auth.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;

/**
 * Entidade que representa uma Role (papel/permissão) no sistema
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "roles")
public class Role implements GrantedAuthority {
    
    @Id
    private String id;
    
    private String name; // Ex: ROLE_USER, ROLE_ADMIN, ROLE_PROFESSOR, etc.
    
    private String description;
    
    public Role(String name) {
        this.name = name;
    }
    
    @Override
    public String getAuthority() {
        return name;
    }
}
