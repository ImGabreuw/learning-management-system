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

    private String teacherUserId;

    private List<String> studentsUserId;

    private List<SubjectDocument> subjectDocuments;

}
