package com.metis.backend.subjects;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.subjects.model.entity.StudentTaskSubmission;
import com.metis.backend.subjects.model.entity.SubjectEntity;
import com.metis.backend.subjects.model.entity.SubjectTaskEntity;
import com.metis.backend.subjects.model.request.SubjectAndTasksRequest;
import com.metis.backend.subjects.model.response.SubjectsAndTasksResponse;
import com.metis.backend.subjects.service.SubjectOrchestrator;
import com.metis.backend.subjects.service.SubjectService;
import com.metis.backend.subjects.service.SubjectTasksService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Import;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@DataMongoTest
@Import({SubjectOrchestrator.class, SubjectTasksService.class, SubjectService.class})
public class SubjectOrchestratorTest {

    @Autowired
    private SubjectOrchestrator subjectOrchestrator;

    @Autowired
    private SubjectTasksService subjectTasksService;

    @Autowired
    private SubjectService subjectService;

    @Test
    public void shouldListByUser(){

        //Criando aluno
        UserEntity student = new UserEntity();
        student.setId("u1");

        //Criando disciplina
        SubjectEntity subject = new SubjectEntity();
        subject.setId("s1");
        subject.setStudentsUserId(List.of(student.getId()));

        //Salvando
        subjectService.saveList(Collections.singletonList(subject));

        //Criando tarefas

        //1. Entidade de tarefa
        SubjectTaskEntity task1 = new SubjectTaskEntity();
        task1.setId("t1");
        task1.setSubjectId(subject.getId());

        SubjectTaskEntity task2 = new SubjectTaskEntity();
        task2.setId("t2");
        task2.setSubjectId(subject.getId());

        SubjectTaskEntity task3 = new SubjectTaskEntity();
        task3.setId("t3");
        task3.setSubjectId(subject.getId());

        //2. Entidade de pontuações
        //Task1
        List<StudentTaskSubmission> studentsScoreT1 = new ArrayList<>();
        StudentTaskSubmission st1Score = new StudentTaskSubmission();
        st1Score.setId("sts1");
        st1Score.setStudentUserId(student.getId());
        studentsScoreT1.add(st1Score);
        task1.setStudentsSubmissions(studentsScoreT1);

        //Task2
        List<StudentTaskSubmission> studentsScoreT2 = new ArrayList<>();
        StudentTaskSubmission st2Score = new StudentTaskSubmission();
        st2Score.setId("sts2");
        st2Score.setStudentUserId(student.getId());
        studentsScoreT2.add(st2Score);
        task2.setStudentsSubmissions(studentsScoreT2);

        //Task3
        List<StudentTaskSubmission> studentsScoreT3 = new ArrayList<>();
        StudentTaskSubmission st3Score = new StudentTaskSubmission();
        st3Score.setId("sts3");
        st3Score.setStudentUserId(student.getId());
        studentsScoreT3.add(st3Score);
        task3.setStudentsSubmissions(studentsScoreT3);

        List<SubjectTaskEntity> tasksToSave = List.of(task1, task2, task3);

        //Salvando
        subjectTasksService.saveList(tasksToSave);

        //Gerando request
        SubjectAndTasksRequest request = new SubjectAndTasksRequest();
        request.setSubjectId(subject.getId());
        request.setUserId(student.getId());

        SubjectsAndTasksResponse response = subjectOrchestrator.listSubjectsAndTasksByUser(request);

        Assert.notNull(response, "response should not be null");
        Assert.notNull(response.getSubject(), "Subject should not be null");
        Assert.notNull(response.getTasks(), "tasks should not be null");
        Assert.notEmpty(response.getTasks(), "tasks should not be empty");
        if(response.getTasks().size() != tasksToSave.size()) {
            throw new RuntimeException(String.format("size of tasks saved (%d) and tasks found (%d) should be equal",
                    tasksToSave.size(),
                    response.getTasks().size()));
        }


    }
}
