package com.metis.backend.subjects.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class SubjectStudent {

    @Id
    private String id;

    @Field("user_associated")
    private String userAssociatedId;

}
