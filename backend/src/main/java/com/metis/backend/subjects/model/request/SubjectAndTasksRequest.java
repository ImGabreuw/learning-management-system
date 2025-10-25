package com.metis.backend.subjects.model.request;

import lombok.Data;

@Data
public class SubjectAndTasksRequest {

    private String userId;

    private String subjectId;
}
