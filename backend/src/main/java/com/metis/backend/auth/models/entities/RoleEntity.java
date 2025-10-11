package com.metis.backend.auth.models.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;

@Document(collection = "roles")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class RoleEntity implements GrantedAuthority {

    @Id
    private String id;

    private String name;

    private String description;

    public RoleEntity(String name) {
        this.name = name;
    }

    @Override
    public String getAuthority() {
        return name;
    }

}
