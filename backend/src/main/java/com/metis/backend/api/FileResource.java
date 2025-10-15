package com.metis.backend.api;

import com.metis.backend.files.models.enums.FileType;
import com.metis.backend.files.models.requests.FileFilterRequest;
import com.metis.backend.files.models.requests.FileUploadRequest;
import com.metis.backend.files.models.responses.FileDownloadResponse;
import com.metis.backend.files.models.responses.FileResponse;
import com.metis.backend.files.models.responses.FileUploadResponse;
import com.metis.backend.files.services.FileStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileResource {

    private final FileStorageService fileStorageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestPart("file") MultipartFile file,
            @RequestPart("metadata") @Valid FileUploadRequest request,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        FileUploadResponse response = fileStorageService.uploadFile(file, request, userId);

        URI location = UriComponentsBuilder
                .fromPath("/api/files/{id}")
                .buildAndExpand(response.getId())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String fileId,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        FileDownloadResponse response = fileStorageService.downloadFile(fileId, userId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(response.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + response.getFilename() + "\"")
                .contentLength(response.getContentLength())
                .body(response.getResource());
    }

    @GetMapping
    public ResponseEntity<Page<FileResponse>> listFiles(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) FileType fileType,
            @RequestParam(required = false) List<String> tags,
            @PageableDefault(size = 20) Pageable pageable,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        FileFilterRequest filterRequest = new FileFilterRequest(title, fileType, tags, userId);
        Page<FileResponse> files = fileStorageService.listFiles(filterRequest, pageable, userId);

        return ResponseEntity.ok(files);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable String fileId,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        fileStorageService.deleteFile(fileId, userId);

        return ResponseEntity.noContent().build();
    }

}

