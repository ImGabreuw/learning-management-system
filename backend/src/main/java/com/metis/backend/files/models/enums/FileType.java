package com.metis.backend.files.models.enums;

import lombok.Getter;

import java.util.Arrays;
import java.util.List;

@Getter
public enum FileType {

    PDF("application/pdf", List.of(".pdf")),
    XLSX("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", List.of(".xlsx")),
    TXT("text/plain", List.of(".txt")),
    WORD("application/vnd.openxmlformats-officedocument.wordprocessingml.document", List.of(".docx", ".doc"));

    private final String mimeType;
    private final List<String> extensions;

    FileType(String mimeType, List<String> extensions) {
        this.mimeType = mimeType;
        this.extensions = extensions;
    }

    public boolean isValid(String contentType) {
        if (contentType == null) {
            return false;
        }
        return this.mimeType.equalsIgnoreCase(contentType);
    }

    public static FileType fromMimeType(String mimeType) {
        return Arrays.stream(FileType.values())
                .filter(type -> type.isValid(mimeType))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Tipo de arquivo não suportado: " + mimeType));
    }
}

