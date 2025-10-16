package com.metis.backend.subjects;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.subjects.model.entity.StudentTaskScore;
import com.metis.backend.subjects.model.entity.SubjectEntity;
import com.metis.backend.subjects.model.entity.SubjectStudent;
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
        UserEntity user = new UserEntity();
        user.setId("u1");

        SubjectStudent student = new SubjectStudent();
        student.setId("st1");
        student.setUserAssociatedId(user.getId());

        //Criando disciplina
        SubjectEntity subject = new SubjectEntity();
        subject.setId("s1");

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
        List<StudentTaskScore> studentsScoreT1 = new ArrayList<>();
        StudentTaskScore st1Score = new StudentTaskScore();
        st1Score.setId("sts1");
        st1Score.setStudent(student);
        studentsScoreT1.add(st1Score);
        task1.setStudentsScore(studentsScoreT1);

        //Task2
        List<StudentTaskScore> studentsScoreT2 = new ArrayList<>();
        StudentTaskScore st2Score = new StudentTaskScore();
        st2Score.setId("sts2");
        st2Score.setStudent(student);
        studentsScoreT2.add(st2Score);
        task2.setStudentsScore(studentsScoreT2);

        //Task3
        List<StudentTaskScore> studentsScoreT3 = new ArrayList<>();
        StudentTaskScore st3Score = new StudentTaskScore();
        st3Score.setId("sts3");
        st3Score.setStudent(student);
        studentsScoreT3.add(st3Score);
        task3.setStudentsScore(studentsScoreT3);

        List<SubjectTaskEntity> tasksToSave = List.of(task1, task2, task3);

        //Salvando
        subjectTasksService.saveList(tasksToSave);

        //Gerando request
        SubjectAndTasksRequest request = new SubjectAndTasksRequest();
        request.setSubjectId(subject.getId());
        request.setUserId(user.getId());

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
