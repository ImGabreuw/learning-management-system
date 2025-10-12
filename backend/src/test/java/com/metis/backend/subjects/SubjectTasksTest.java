package com.metis.backend.subjects;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.subjects.model.entity.StudentTaskScore;
import com.metis.backend.subjects.model.entity.SubjectEntity;
import com.metis.backend.subjects.model.entity.SubjectStudent;
import com.metis.backend.subjects.model.entity.SubjectTaskEntity;
import com.metis.backend.subjects.service.SubjectTasksService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Import;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@DataMongoTest
@Import(SubjectTasksService.class)
public class SubjectTasksTest {

    @Autowired
    private SubjectTasksService subjectTasksService;

    @Test
    public void shouldSaveAndListBySubjectAndStudent() {
        //Criando aluno
        UserEntity user = new UserEntity();
        user.setId("u1");

        SubjectStudent student = new SubjectStudent();
        student.setId("st1");
        student.setUserAssociatedId(user.getId());

        //Criando disciplina
        SubjectEntity subject = new SubjectEntity();
        subject.setId("s1");

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

        //Salvando no banco
        List<SubjectTaskEntity> tasksToSave = List.of(task1, task2, task3);

        subjectTasksService.saveList(tasksToSave);

        //Procurando no banco
        List<SubjectTaskEntity> tasksFound = subjectTasksService.listBySubjectAndStudent(subject.getId(), student.getId());

        //Validando
        Assert.notNull(tasksFound, "Tasks not Found: Null list");
        Assert.noNullElements(tasksFound, "Tasks not Found: Null elements found");
        Assert.notEmpty(tasksFound, "Tasks not Found: Empty list");
        if(tasksFound.size() != tasksToSave.size()) {
            throw new RuntimeException("Tasks not found: Size mismatch");
        }

    }

    @Test
    public void shouldSaveAndListBySubject() {

        //Criando disciplina
        SubjectEntity subject = new SubjectEntity();
        subject.setId("s1");

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

        //Salvando no banco
        List<SubjectTaskEntity> tasksToSave = List.of(task1, task2, task3);

        subjectTasksService.saveList(tasksToSave);

        //Procurando no banco
        List<SubjectTaskEntity> tasksFound = subjectTasksService.listBySubject(subject.getId());

        //Validando
        Assert.notNull(tasksFound, "Tasks not Found: Null list");
        Assert.noNullElements(tasksFound, "Tasks not Found: Null elements found");
        Assert.notEmpty(tasksFound, "Tasks not Found: Empty list");
        if(tasksFound.size() != tasksToSave.size()) {
            throw new RuntimeException("Tasks not found: Size mismatch");
        }

    }

    @Test
    public void shouldSaveAndListBySubjectsIn() {

        //Criando disciplinas
        SubjectEntity subject = new SubjectEntity();
        subject.setId("s1");

        SubjectEntity subject2 = new SubjectEntity();
        subject2.setId("s2");

        SubjectEntity subject3 = new SubjectEntity();
        subject3.setId("s3");

        //Criando tarefas

        //1. Entidade de tarefa
        SubjectTaskEntity task1 = new SubjectTaskEntity();
        task1.setId("t1");
        task1.setSubjectId(subject.getId());

        SubjectTaskEntity task2 = new SubjectTaskEntity();
        task2.setId("t2");
        task2.setSubjectId(subject2.getId());

        SubjectTaskEntity task3 = new SubjectTaskEntity();
        task3.setId("t3");
        task3.setSubjectId(subject3.getId());

        //Salvando no banco
        List<SubjectTaskEntity> tasksToSave = List.of(task1, task2, task3);
        List<String> subjectIds = List.of("s1", "s2", "s3");

        subjectTasksService.saveList(tasksToSave);

        //Procurando no banco
        List<SubjectTaskEntity> tasksFound = subjectTasksService.listBySubjectsIn(subjectIds);

        //Validando
        Assert.notNull(tasksFound, "Tasks not Found: Null list");
        Assert.noNullElements(tasksFound, "Tasks not Found: Null elements found");
        Assert.notEmpty(tasksFound, "Tasks not Found: Empty list");
        if(tasksFound.size() != tasksToSave.size()) {
            throw new RuntimeException("Tasks not found: Size mismatch");
        }

    }
}
