package com.metis.backend.subjects;

import com.metis.backend.auth.models.entities.UserEntity;
import com.metis.backend.subjects.model.entity.SubjectEntity;
import com.metis.backend.subjects.service.SubjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Import;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.List;

@DataMongoTest
@Import(SubjectService.class)
public class SubjectTest {

    @Autowired
    private SubjectService subjectService;

    @Test
    public void shouldSaveAndFindById(){
        SubjectEntity subjectEntity = new SubjectEntity();
        subjectEntity.setId("s1");

        subjectService.saveList(Collections.singletonList(subjectEntity));

        SubjectEntity result = subjectService.findById("s1");

        Assert.notNull(result, "Subject not found");
    }

    @Test
    public void shouldSaveAndListByTeacher() {
        //Definindo professor
        UserEntity teacher = new UserEntity();
        teacher.setId("u1");

        //Criando disciplinas associadas
        SubjectEntity subject = new SubjectEntity();
        subject.setId("s1");
        subject.setTeacherUserId(teacher.getId());

        SubjectEntity subject2 = new SubjectEntity();
        subject2.setId("s2");
        subject2.setTeacherUserId(teacher.getId());

        SubjectEntity subject3 = new SubjectEntity();
        subject3.setId("s3");
        subject3.setTeacherUserId(teacher.getId());

        //Salvando no banco
        List<SubjectEntity> subjectsToSave = List.of(subject, subject2, subject3);

        subjectService.saveList(subjectsToSave);

        //Procurando no banco
        List<SubjectEntity> subjectsFound = subjectService.listByTeacher(teacher.getId());

        //Verificando se foram encontradas
        Assert.notNull(subjectsFound, "Subjects not found: Null list");
        Assert.noNullElements(subjectsFound, "subjects not found: Null elements found");
        Assert.notEmpty(subjectsFound, "subjects not found: Empty list");
        if(subjectsFound.size() != subjectsToSave.size()) {
            throw new RuntimeException("Subjects not found: Size mismatch");
        }

    }

    @Test
    public void shouldSaveAndListByStudent() {
        //Definindo aluno
        UserEntity student = new UserEntity();
        student.setId("u1");

        //Criando disciplinas
        SubjectEntity subject = new SubjectEntity();
        subject.setId("s1");
        subject.setStudentsUserId(List.of(student.getId()));

        SubjectEntity subject2 = new SubjectEntity();
        subject2.setId("s2");
        subject2.setStudentsUserId(List.of(student.getId()));

        SubjectEntity subject3 = new SubjectEntity();
        subject3.setId("s3");
        subject3.setStudentsUserId(List.of(student.getId()));

        //Salvando no banco
        List<SubjectEntity> subjectsToSave = List.of(subject, subject2, subject3);

        subjectService.saveList(subjectsToSave);

        //Procurando no banco
        List<SubjectEntity> subjectsFound = subjectService.listByStudent(student.getId());

        //Verificando se foram encontradas
        Assert.notNull(subjectsFound, "subjects not found:  Null list");
        Assert.noNullElements(subjectsFound, "subjects not found: Null elements found");
        Assert.notEmpty(subjectsFound, "subjects not found: Empty list");
        if(subjectsFound.size() != subjectsToSave.size()) {
            throw new RuntimeException("Subjects not found: Size mismatch");
        }

    }

}
