package com.metis.backend.shared;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class Utility {

    public static String serializeListToString(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "";
        }
        return String.join(";", list);
    }

    public static List<String> deserializeStringToList(String str) {
        if (str == null || str.isEmpty()) {
            return List.of();
        }
        return List.of(str.split(";"));
    }

    public static String convertToNodeId(String value) {
        if (value == null || value.isEmpty()) {
            throw new IllegalArgumentException("Value cannot be null or empty");
        }

        // decompor caracteres Unicode compostos em forma "base + marcas". Ex. é → e + acento
        String normalized = java.text.Normalizer.normalize(value, java.text.Normalizer.Form.NFD);

        // normalizar e remover acentos
        normalized = normalized.replaceAll("\\p{M}", "");

        // substituir qualquer caracter não alfanumérico por underscore
        normalized = normalized.trim().replaceAll("[^\\p{Alnum}]+", "_");

        // colapsar múltiplos underscores consecutivos em apenas um
        normalized = normalized.replaceAll("_+", "_");

        // remover underscores no início ou no fim da string
        normalized = normalized.replaceAll("^_+|_+$", "");

        return normalized.toLowerCase();
    }

    public static boolean isUUID(String str) {
        try {
            UUID.fromString(str);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

}
