package com.metis.backend.subjects.service;

import com.metis.backend.subjects.model.entity.SubjectTaskEntity;
import com.metis.backend.subjects.repository.SubjectTasksRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectTasksService {

    private final SubjectTasksRepository subjectTasksRepository;

    @Transactional(readOnly = true)
    public List<SubjectTaskEntity> listBySubjectAndStudent(String subjectId, String studentId) {
        return subjectTasksRepository.findBySubjectAndStudent(subjectId, studentId);
    }

    @Transactional(readOnly = true)
    public List<SubjectTaskEntity> listBySubject(String subjectId) {
        return subjectTasksRepository.findBySubject(subjectId);
    }

    @Transactional(readOnly = true)
    public List<SubjectTaskEntity> listBySubjectsIn(List<String> listOfSubjectsIds) {
        return subjectTasksRepository.findBySubjectsIn(listOfSubjectsIds);
    }

    @Transactional
    public void saveList(List<SubjectTaskEntity> subjectTasks) {
        subjectTasksRepository.saveAll(subjectTasks);
    }

}
