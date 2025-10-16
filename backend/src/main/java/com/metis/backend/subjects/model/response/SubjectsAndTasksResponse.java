package com.metis.backend.subjects.model.response;

import com.metis.backend.subjects.model.entity.SubjectEntity;
import com.metis.backend.subjects.model.entity.SubjectTaskEntity;
import lombok.Data;

import java.util.List;

@Data
public class SubjectsAndTasksResponse {

    private SubjectEntity subject;

    private List<SubjectTaskEntity> tasks;
}
