package com.metis.backend.subjects.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class SubjectDocument {

    @Id
    private String id;

    @Field("file_name")
    private String fileName;

    @Field("file_content")
    private byte[] fileContent;


}
