package com.metis.backend.subjects.repository;

import com.metis.backend.subjects.model.entity.SubjectEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface SubjectRepository extends MongoRepository<SubjectEntity, String> {

    @Query("{'teacherUserId' : ?0 }")
    List<SubjectEntity> findByTeacher(String teacherUserId);

    @Query("{ 'studentsUserId' : ?0 }")
    List<SubjectEntity> findByStudent(String studentUserId);

}
