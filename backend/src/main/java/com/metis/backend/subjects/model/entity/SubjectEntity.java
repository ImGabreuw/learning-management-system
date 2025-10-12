package com.metis.backend.subjects.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "subjects")
@Data
public class SubjectEntity {

    @Id
    private String id;

    @Field("name")
    private String name;

    @Field("description")
    private String description;

    @Field("teacher")
    private SubjectTeacher teacher;

    @Field("students")
    private List<SubjectStudent> students;

    @Field("documents")
    private List<SubjectDocument> subjectDocuments;

}
