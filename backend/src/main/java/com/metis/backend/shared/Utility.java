package com.metis.backend.shared;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;

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

        return value
                .trim()
                .replaceAll("\\s+", "_")
                .toLowerCase();
    }

}
