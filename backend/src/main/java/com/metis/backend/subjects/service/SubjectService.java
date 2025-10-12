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
    public List<SubjectEntity> listByTeacher(String teacherId) {
        return subjectRepository.findByTeacher(teacherId);
    }

    @Transactional(readOnly = true)
    public List<SubjectEntity> listByStudent(String studentId) {
        return subjectRepository.findByStudent(studentId);
    }

    @Transactional
    public void saveList(List<SubjectEntity> subjects) {
        subjectRepository.saveAll(subjects);
    }
}
