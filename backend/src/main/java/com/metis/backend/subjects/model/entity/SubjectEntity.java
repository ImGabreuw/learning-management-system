package com.metis.backend.subjects.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "subjects")
@Data
public class SubjectEntity {

    @Id
    private String id;

    private String name;

    private String description;

    private SubjectTeacher teacher;

    private List<SubjectStudent> students;

    private List<SubjectDocument> subjectDocuments;

}
