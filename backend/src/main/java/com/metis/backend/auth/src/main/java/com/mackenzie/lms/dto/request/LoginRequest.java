package com.mackenzie.lms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class LoginRequest {

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter formato válido")
    @Pattern(regexp = ".*@mackenzie\\.br$", message = "Email deve ser do domínio @mackenzie.br")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    private String password;

    public LoginRequest() {}

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public boolean isEmailMackenzieValido() {
        return email != null && email.endsWith("@mackenzie.br");
    }

    public void validar() {
        if (!isEmailMackenzieValido()) {
            throw new IllegalArgumentException("Email deve ser do domínio @mackenzie.br");
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