package com.metis.backend.auth.models.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "token_blacklist")
public class TokenBlacklist {

    @Id
    private String id;

    @Indexed(unique = true)
    private String token;

    private String userEmail;

    private LocalDateTime blacklistedAt;

    @Indexed(expireAfterSeconds = 86400) // Expira após 24 horas (mesmo tempo do JWT)
    private LocalDateTime expiresAt;
}
