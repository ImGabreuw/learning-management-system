package com.metis.backend.files.exceptions;

public class UnauthorizedFileAccessException extends RuntimeException {

    public UnauthorizedFileAccessException(String message) {
        super(message);
    }
}

