package com.metis.backend.api;

import com.metis.backend.subjects.model.entity.SubjectEntity;
import com.metis.backend.subjects.model.entity.SubjectTaskEntity;
import com.metis.backend.subjects.service.SubjectService;
import com.metis.backend.subjects.service.SubjectTasksService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectResource {

    private final SubjectService subjectService;
    private final SubjectTasksService subjectTasksService;

    @GetMapping
    public ResponseEntity<List<SubjectEntity>> listSubjects(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String role
    ) {
        String userId = userDetails.getUsername();
        List<SubjectEntity> subjects;

        if ("teacher".equalsIgnoreCase(role)) {
            subjects = subjectService.listByTeacher(userId);
            log.info("Listing subjects for teacher: {}", userId);
        } else {
            subjects = subjectService.listByStudent(userId);
            log.info("Listing subjects for student: {}", userId);
        }

        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/{subjectId}")
    public ResponseEntity<SubjectEntity> getSubjectById(
            @PathVariable String subjectId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        SubjectEntity subject = subjectService.findById(subjectId);

        if (subject == null) {
            log.warn("Subject not found: {}", subjectId);
            return ResponseEntity.notFound().build();
        }

        log.info("Subject {} retrieved by user: {}", subjectId, userDetails.getUsername());
        return ResponseEntity.ok(subject);
    }

    @GetMapping("/{subjectId}/tasks")
    public ResponseEntity<List<SubjectTaskEntity>> getSubjectTasks(
            @PathVariable String subjectId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<SubjectTaskEntity> tasks = subjectTasksService.listBySubjectsIn(List.of(subjectId));
        log.info("Retrieved {} tasks for subject: {}", tasks.size(), subjectId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<SubjectEntity> createSubject(
            @RequestBody SubjectEntity subject,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        subject.setTeacherUserId(userDetails.getUsername());
        subjectService.saveList(List.of(subject));
        
        log.info("Subject created: {} by user: {}", subject.getName(), userDetails.getUsername());

        URI location = UriComponentsBuilder
                .fromPath("/api/subjects/{id}")
                .buildAndExpand(subject.getId())
                .toUri();

        return ResponseEntity.created(location).body(subject);
    }

    @PostMapping("/tasks")
    public ResponseEntity<SubjectTaskEntity> createTask(
            @RequestBody SubjectTaskEntity task,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        subjectTasksService.saveList(List.of(task));
        log.info("Task created for subject: {} by user: {}", task.getSubjectId(), userDetails.getUsername());

        URI location = UriComponentsBuilder
                .fromPath("/api/subjects/tasks/{id}")
                .buildAndExpand(task.getId())
                .toUri();

        return ResponseEntity.created(location).body(task);
    }

    @PostMapping("/batch")
    public ResponseEntity<Void> createSubjectsBatch(
            @RequestBody List<SubjectEntity> subjects,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        subjectService.saveList(subjects);
        log.info("Batch of {} subjects created by user: {}", subjects.size(), userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

}
