package com.metis.backend.subjects.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "subject_tasks")
@Data
public class SubjectTaskEntity {

    @Id
    private String id;

    @Field("description")
    private String description;

    @Field("start_at")
    private LocalDateTime startAt;

    @Field("end_at")
    private LocalDateTime endAt;

    @Field("subject")
    private String subjectId;

    @Field("students_score")
    private List<StudentTaskScore> studentsScore;


}
