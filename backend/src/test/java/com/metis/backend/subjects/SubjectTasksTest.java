package com.metis.backend.subjects;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.subjects.model.entity.StudentTaskSubmission;
import com.metis.backend.subjects.model.entity.SubjectEntity;
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
        UserEntity student = new UserEntity();
        student.setId("u1");

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
        List<StudentTaskSubmission> studentsSubmissionsT1 = new ArrayList<>();
        StudentTaskSubmission st1Submission = new StudentTaskSubmission();
        st1Submission.setId("sts1");
        st1Submission.setStudentUserId(student.getId());
        studentsSubmissionsT1.add(st1Submission);
        task1.setStudentsSubmissions(studentsSubmissionsT1);

        //Task2
        List<StudentTaskSubmission> studentsSubmissionsT2 = new ArrayList<>();
        StudentTaskSubmission st2Submission = new StudentTaskSubmission();
        st2Submission.setId("sts2");
        st2Submission.setStudentUserId(student.getId());
        studentsSubmissionsT2.add(st2Submission);
        task2.setStudentsSubmissions(studentsSubmissionsT2);

        //Task3
        List<StudentTaskSubmission> studentsSubmissionsT3 = new ArrayList<>();
        StudentTaskSubmission st3Submission = new StudentTaskSubmission();
        st3Submission.setId("sts3");
        st3Submission.setStudentUserId(student.getId());
        studentsSubmissionsT3.add(st3Submission);
        task3.setStudentsSubmissions(studentsSubmissionsT3);

        //Salvando no banco
        List<SubjectTaskEntity> tasksToSave = List.of(task1, task2, task3);

        subjectTasksService.saveList(tasksToSave);

        //Procurando no banco
        List<SubjectTaskEntity> tasksFound = subjectTasksService.listBySubjectAndStudent(
                subject.getId(),
                student.getId());

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
