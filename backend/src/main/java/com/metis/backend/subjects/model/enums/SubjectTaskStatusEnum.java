package com.metis.backend.subjects.model.enums;

public enum SubjectTaskStatusEnum {
    PENDING("Pendente"),
    SUBMITTED("Enviada"),
    GRADED("Avaliada"),
    LATE("Atrasada"),
    RETURNED("Devolvida");

    private final String translation;

    SubjectTaskStatusEnum(String translation) {
        this.translation = translation;
    }

    public String getTranslation() {
        return this.translation;
    }
}
