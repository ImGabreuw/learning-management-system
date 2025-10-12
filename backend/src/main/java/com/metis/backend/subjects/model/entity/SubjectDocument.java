package com.metis.backend.subjects.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class SubjectDocument {

    @Id
    private String id;

    private String fileName;

    private byte[] fileContent;


}
