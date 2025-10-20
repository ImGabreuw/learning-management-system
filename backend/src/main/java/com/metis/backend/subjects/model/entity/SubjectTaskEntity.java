package com.metis.backend.subjects.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "subject_tasks")
@Data
public class SubjectTaskEntity {

    @Id
    private String id;

    private String description;

    private LocalDateTime startAt;

    private LocalDateTime endAt;

    private String subjectId;

    private List<StudentTaskSubmission> studentsSubmissions;

    private SubjectTaskTypeEnum type;


}
