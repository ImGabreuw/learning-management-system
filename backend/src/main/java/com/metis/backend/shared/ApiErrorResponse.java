package com.metis.backend.shared;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiErrorResponse {

    private String message;
    private Object data;

    public static ApiErrorResponse of(String message, Object data) {
        return ApiErrorResponse.builder()
                .message(message)
                .data(data)
                .build();
    }

    public static ApiErrorResponse of(String message) {
        return of(message, null);
    }

}
