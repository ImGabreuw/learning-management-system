package com.metis.backend.subjects.model.entity;

import com.metis.backend.subjects.model.enums.SubjectTaskStatusEnum;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Data
public class StudentTaskSubmission {

    @Id
    private String id;

    private String studentUserId;

    private Float score;

    private LocalDateTime submittedAt;

    private SubjectTaskStatusEnum status;
}
