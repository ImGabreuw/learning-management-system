package com.mackenzie.lms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class LoginRequest {
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter formato válido")
    private String email;
    
    @NotBlank(message = "Senha é obrigatória")
    private String password;
    
    // Domínios permitidos
    private static final String[] ALLOWED_DOMAINS = {
        "@mackenzie.br",
        "@mackenzista.com.br"  // Adicione outros domínios aqui
    };
    
    public LoginRequest() {}
    
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    public boolean isEmailMackenzieValido() {
        if (email == null) return false;
        
        for (String domain : ALLOWED_DOMAINS) {
            if (email.endsWith(domain)) {
                return true;
            }
        }
        return false;
    }
    
    public void validar() {
        if (!isEmailMackenzieValido()) {
            throw new IllegalArgumentException(
                "Email deve ser de um dos domínios permitidos: " + 
                String.join(", ", ALLOWED_DOMAINS)
            );
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }
    }
    
    // Getters and Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
