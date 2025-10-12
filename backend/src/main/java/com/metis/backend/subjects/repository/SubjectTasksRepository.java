package com.metis.backend.subjects.repository;

import com.metis.backend.subjects.model.entity.SubjectTaskEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface SubjectTasksRepository extends MongoRepository<SubjectTaskEntity, String> {

    @Query("{'subject': ?0, 'students_score' : { $elemMatch : {'student.id' : ?1}}")
    public List<SubjectTaskEntity> findBySubjectAndStudent(String subjectId, String studentId);

    @Query("{'subject': ?0}")
    public List<SubjectTaskEntity> findBySubject(String subjectId);

    @Query("{'subject' : {$in : ?0}}")
    public List<SubjectTaskEntity> findBySubjectsIn(List<String> listOfSubjectsIds);


}
