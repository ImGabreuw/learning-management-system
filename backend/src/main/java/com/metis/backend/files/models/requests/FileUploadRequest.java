package com.metis.backend.files.models.requests;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record FileUploadRequest(
        @NotBlank(message = "O título é obrigatório")
        String title,

        String description,

        List<String> tags
) {
}
