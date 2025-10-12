package com.metis.backend.subjects.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class StudentTaskScore {

    @Id
    private String id;

    @Field("student")
    private SubjectStudent student;

    @Field("score")
    private double score;
}
