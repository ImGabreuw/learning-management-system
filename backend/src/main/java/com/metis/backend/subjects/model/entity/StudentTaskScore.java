package com.metis.backend.subjects.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class StudentTaskScore {

    @Id
    private String id;

    private SubjectStudent student;

    private double score;
}
