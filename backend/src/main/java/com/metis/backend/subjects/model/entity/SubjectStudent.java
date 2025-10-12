package com.metis.backend.subjects.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class SubjectStudent {

    @Id
    private String id;

    private String userAssociatedId;

}
