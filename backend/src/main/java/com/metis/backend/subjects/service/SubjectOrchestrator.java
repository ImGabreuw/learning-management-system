package com.metis.backend.subjects.service;

import com.metis.backend.subjects.model.entity.SubjectEntity;
import com.metis.backend.subjects.model.entity.SubjectTaskEntity;
import com.metis.backend.subjects.model.request.SubjectAndTasksRequest;
import com.metis.backend.subjects.model.response.SubjectsAndTasksResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectOrchestrator {

    private final SubjectService subjectService;

    private final SubjectTasksService subjectTasksService;


    public SubjectsAndTasksResponse listSubjectsAndTasksByUser(SubjectAndTasksRequest subjectAndTasksRequest) {
        SubjectsAndTasksResponse response = new  SubjectsAndTasksResponse();

        //Procura a disciplina mencionada
        SubjectEntity subject = subjectService.findById(subjectAndTasksRequest.getSubjectId());

        //Procura as tarefas associadas
        List<SubjectTaskEntity> tasks = subjectTasksService.listBySubject(subject.getId());

        response.setSubject(subject);
        response.setTasks(tasks);

        return response;

    }
}
