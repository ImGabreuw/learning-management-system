package br.mackenzie.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * Classe principal da aplicação Mackenzie Authentication Service
 * 
 * Serviço de Autenticação e Autorização com:
 * - OAuth2 Microsoft/Outlook
 * - JWT (JSON Web Tokens)
 * - MongoDB
 * - Role-Based Access Control (RBAC)
 * 
 * @author Mackenzie Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableMongoAuditing
public class AuthApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
    }
}
