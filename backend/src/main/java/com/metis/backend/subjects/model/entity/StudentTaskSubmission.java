package com.metis.backend.subjects.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class StudentTaskSubmission {

    @Id
    private String id;

    private String studentUserId;

    private double score;

    private LocalDateTime submittedIn;
}
