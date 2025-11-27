package com.metis.backend.api;

import com.metis.backend.subjects.model.request.SubjectAndTasksRequest;
import com.metis.backend.subjects.model.response.SubjectsAndTasksResponse;
import com.metis.backend.subjects.service.SubjectOrchestrator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectsResource {

    private final SubjectOrchestrator subjectOrchestrator;

    @GetMapping("/tasks")
    public ResponseEntity<SubjectsAndTasksResponse> listSubjectTasksByStudent(@RequestBody SubjectAndTasksRequest request){
        SubjectsAndTasksResponse response = subjectOrchestrator.listSubjectsAndTasksByUser(request);

        return ResponseEntity.ok(response);
    }
}
