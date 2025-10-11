package com.metis.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Data
@ConfigurationProperties(prefix = "metis")
public class MetisProperties {

    private Auth auth = new Auth();
    private Jwt jwt = new Jwt();

    @Data
    public static class Auth {
        private List<String> allowedEmailDomains;
        private List<String> defaultRoles;
        private List<String> adminEmails;
    }

    @Data
    public static class Jwt {
        private String secret;
        private Long expiration;
        private Long refreshExpiration;
    }

}

