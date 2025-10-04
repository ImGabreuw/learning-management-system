package com.metis.backend.auth.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;

@Document(collection = "roles")
public class Role implements GrantedAuthority {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String description;

    private LocalDateTime createdAt;

    public Role() {
        this.createdAt = LocalDateTime.now();
    }

    public Role(String name, String description) {
        this();
        this.name = name;
        this.description = description;
    }

    @Override
    public String getAuthority() {
        return "ROLE_" + name;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Role role = (Role) obj;
        return name != null ? name.equals(role.name) : role.name == null;
    }

    @Override
    public int hashCode() {
        return name != null ? name.hashCode() : 0;
    }
}