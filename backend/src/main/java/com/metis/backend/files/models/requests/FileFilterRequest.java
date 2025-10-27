package com.metis.backend.files.models.requests;

import com.metis.backend.files.models.enums.FileType;

import java.util.List;

public record FileFilterRequest(
        String title,
        FileType fileType,
        List<String> tags,
        String uploadedBy
) {
}