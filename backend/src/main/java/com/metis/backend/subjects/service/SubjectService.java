package com.metis.backend.subjects.service;

import com.metis.backend.subjects.model.entity.SubjectEntity;
import com.metis.backend.subjects.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

    @Transactional(readOnly = true)
    public List<SubjectEntity> listByTeacher(String teacherUserId) {
        return subjectRepository.findByTeacher(teacherUserId);
    }

    @Transactional(readOnly = true)
    public List<SubjectEntity> listByStudent(String studentUserId) {
        return subjectRepository.findByStudent(studentUserId);
    }

    @Transactional(readOnly = true)
    public SubjectEntity findById(String subjectId) {
        return subjectRepository.findById(subjectId);
    }

    @Transactional
    public void saveList(List<SubjectEntity> subjects) {
        subjectRepository.saveAll(subjects);
    }


}
