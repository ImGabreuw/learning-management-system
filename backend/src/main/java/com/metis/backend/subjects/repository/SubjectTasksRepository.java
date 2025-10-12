package com.metis.backend.subjects.repository;

import com.metis.backend.subjects.model.entity.SubjectTaskEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface SubjectTasksRepository extends MongoRepository<SubjectTaskEntity, String> {

    @Query("{'subjectId': ?0, 'studentsScore' : { $elemMatch : {'student.userAssociatedId' : ?1}}}")
    List<SubjectTaskEntity> findBySubjectAndStudent(String subjectId, String studentUserId);

    @Query("{'subjectId': ?0}")
    List<SubjectTaskEntity> findBySubject(String subjectId);

    @Query("{'subjectId' : {$in : ?0}}")
    List<SubjectTaskEntity> findBySubjectsIn(List<String> listOfSubjectsIds);


}
