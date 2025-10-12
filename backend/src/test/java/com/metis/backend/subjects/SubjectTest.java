package com.metis.backend.subjects;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.subjects.model.entity.SubjectEntity;
import com.metis.backend.subjects.model.entity.SubjectStudent;
import com.metis.backend.subjects.model.entity.SubjectTeacher;
import com.metis.backend.subjects.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

@DataMongoTest
@RequiredArgsConstructor
public class SubjectTest {

    private final SubjectService subjectService;

    @Test
    public void shouldSaveAndListByTeacher() {
        //Definindo professor
        UserEntity user = new UserEntity();
        user.setId("u1");

        SubjectTeacher teacher = new SubjectTeacher();
        teacher.setId("t1");
        teacher.setUserAssociatedId("u1");

        //Criando disciplinas associadas
        SubjectEntity subject = new SubjectEntity();
        subject.setId("s1");
        subject.setTeacher(teacher);

        SubjectEntity subject2 = new SubjectEntity();
        subject2.setId("s2");
        subject2.setTeacher(teacher);

        SubjectEntity subject3 = new SubjectEntity();
        subject3.setId("s3");
        subject3.setTeacher(teacher);

        //Salvando no banco
        List<SubjectEntity> subjectsToSave = List.of(subject, subject2, subject3);

        subjectService.saveList(subjectsToSave);

        //Procurando no banco
        List<SubjectEntity> subjectsFound = subjectService.listByTeacher("t1");

        //Verificando se foram encontradas
        Assert.notNull(subjectsFound, "Subjects not found: Null list");
        Assert.noNullElements(subjectsFound, "subjects not found: Null elements found");
        Assert.notEmpty(subjectsFound, "subjects not found: Empty list");

    }

    @Test
    public void shouldSaveAndListByStudent() {
        //Definindo aluno
        UserEntity user = new UserEntity();
        user.setId("u1");

        SubjectStudent student = new SubjectStudent();
        student.setId("st1");
        student.setUserAssociatedId("u1");

        //Criando disciplinas
        SubjectEntity subject = new SubjectEntity();
        subject.setId("s1");
        subject.setStudents(new ArrayList<>());
        subject.getStudents().add(student);

        SubjectEntity subject2 = new SubjectEntity();
        subject2.setId("s2");
        subject2.setStudents(new ArrayList<>());
        subject2.getStudents().add(student);

        SubjectEntity subject3 = new SubjectEntity();
        subject3.setId("s3");
        subject3.setStudents(new ArrayList<>());
        subject3.getStudents().add(student);

        //Salvando no banco
        List<SubjectEntity> subjectsToSave = List.of(subject, subject2, subject3);

        subjectService.saveList(subjectsToSave);

        //Procurando no banco
        List<SubjectEntity> subjectsFound = subjectService.listByStudent("st1");

        //Verificando se foram encontradas
        Assert.notNull(subjectsFound, "subjects not found:  Null list");
        Assert.noNullElements(subjectsFound, "subjects not found: Null elements found");
        Assert.notEmpty(subjectsFound, "subjects not found: Empty list");

    }

}
