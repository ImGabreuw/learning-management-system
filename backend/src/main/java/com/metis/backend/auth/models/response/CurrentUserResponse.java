package com.metis.backend.auth.models.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurrentUserResponse {

    private String email;
    private String name;
    private List<String> roles;
    private boolean enabled;
    private String lastLoginAt;

}

