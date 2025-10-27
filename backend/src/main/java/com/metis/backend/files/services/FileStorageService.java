package com.metis.backend.files.services;

import com.metis.backend.files.exceptions.FileNotFoundException;
import com.metis.backend.files.exceptions.FileStorageException;
import com.metis.backend.files.exceptions.UnauthorizedFileAccessException;
import com.metis.backend.files.models.entities.FileMetadata;
import com.metis.backend.files.models.enums.FileType;
import com.metis.backend.files.models.requests.FileFilterRequest;
import com.metis.backend.files.models.requests.FileUploadRequest;
import com.metis.backend.files.models.responses.FileDownloadResponse;
import com.metis.backend.files.models.responses.FileResponse;
import com.metis.backend.files.models.responses.FileUploadResponse;
import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final GridFsTemplate gridFsTemplate;
    private final GridFsOperations gridFsOperations;

    public FileUploadResponse uploadFile(MultipartFile file, FileUploadRequest request, String userId) {
        validateFile(file);

        FileType fileType = FileType.fromMimeType(file.getContentType());

        FileMetadata metadata = FileMetadata.builder()
                .fileType(fileType)
                .title(request.title())
                .description(request.description())
                .tags(request.tags() != null ? request.tags() : new ArrayList<>())
                .uploadedBy(userId)
                .build();

        Document metaDoc = new Document()
                .append("fileType", metadata.getFileType().name())
                .append("title", metadata.getTitle())
                .append("description", metadata.getDescription())
                .append("tags", metadata.getTags())
                .append("uploadedBy", metadata.getUploadedBy());

        ObjectId fileId;
        try {
            fileId = gridFsTemplate.store(
                    file.getInputStream(),
                    file.getOriginalFilename(),
                    file.getContentType(),
                    metaDoc
            );
        } catch (IOException e) {
            throw new FileStorageException("Erro ao armazenar o arquivo");
        }

        return FileUploadResponse.builder()
                .id(fileId.toString())
                .filename(file.getOriginalFilename())
                .contentType(file.getContentType())
                .size(file.getSize())
                .build();
    }

    public FileDownloadResponse downloadFile(String fileId, String userId) {
        ObjectId objectId = new ObjectId(fileId);
        GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(objectId)));

        if (gridFSFile == null) {
            throw new FileNotFoundException("Arquivo não encontrado");
        }

        Document metadata = gridFSFile.getMetadata();
        if (metadata != null) {
            String uploadedBy = metadata.getString("uploadedBy");
            if (!userId.equals(uploadedBy)) {
                throw new UnauthorizedFileAccessException("Você não tem permissão para acessar este arquivo");
            }
        }

        GridFsResource resource = gridFsOperations.getResource(gridFSFile);

        String contentType = gridFSFile.getMetadata() != null
                ? gridFSFile.getMetadata().getString("_contentType")
                : "application/octet-stream";

        InputStreamResource isr;
        try {
            isr = new InputStreamResource(resource.getInputStream());
        } catch (IOException e) {
            throw new FileStorageException("Erro ao ler o arquivo");
        }

        return FileDownloadResponse.builder()
                .resource(isr)
                .filename(gridFSFile.getFilename())
                .contentType(contentType)
                .contentLength(gridFSFile.getLength())
                .build();
    }

    public Page<FileResponse> findAllFiles(FileFilterRequest filterRequest, Pageable pageable, String userId) {
        Query query = new Query();

        query.addCriteria(Criteria.where("metadata.uploadedBy").is(userId));

        if (filterRequest != null) {
            if (filterRequest.title() != null && !filterRequest.title().isBlank()) {
                query.addCriteria(Criteria.where("metadata.title").regex(filterRequest.title(), "i"));
            }
            if (filterRequest.fileType() != null) {
                query.addCriteria(Criteria.where("metadata.fileType").is(filterRequest.fileType().name()));
            }
            if (filterRequest.tags() != null && !filterRequest.tags().isEmpty()) {
                query.addCriteria(Criteria.where("metadata.tags").in(filterRequest.tags()));
            }
        }

        long total = gridFsTemplate.find(query).into(new ArrayList<>()).size();
        query.with(pageable);

        List<GridFSFile> gridFSFiles = gridFsTemplate.find(query).into(new ArrayList<>());

        List<FileResponse> responses = gridFSFiles.stream()
                .map(this::mapToFileResponse)
                .toList();

        return new PageImpl<>(responses, pageable, total);
    }

    public void deleteFile(String fileId, String userId) {
        try {
            ObjectId objectId = new ObjectId(fileId);
            GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(objectId)));

            Document metadata = gridFSFile.getMetadata();
            if (metadata != null) {
                String uploadedBy = metadata.getString("uploadedBy");
                if (!userId.equals(uploadedBy)) {
                    log.warn("Unauthorized deletion attempt by user {} for file {}", userId, fileId);
                    throw new UnauthorizedFileAccessException("Você não tem permissão para excluir este arquivo");
                }
            }

            gridFsTemplate.delete(new Query(Criteria.where("_id").is(objectId)));
            log.info("File deleted successfully with ID: {}", fileId);

        } catch (IllegalArgumentException e) {
            log.error("Invalid file ID format: {}", fileId);
            throw new FileNotFoundException("ID de arquivo inválido");
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("O arquivo não pode ser vazio");
        }

        if (file.getOriginalFilename() == null || file.getOriginalFilename().isBlank()) {
            throw new IllegalArgumentException("O nome do arquivo é obrigatório");
        }

        try {
            FileType.fromMimeType(file.getContentType());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Tipo de arquivo não permitido. Tipos aceitos: PDF, XLSX, TXT, WORD");
        }
    }

    private FileResponse mapToFileResponse(GridFSFile gridFSFile) {
        Document metadata = gridFSFile.getMetadata();

        return FileResponse.builder()
                .id(gridFSFile.getObjectId().toString())
                .filename(gridFSFile.getFilename())
                .contentType(metadata != null ? metadata.getString("_contentType") : null)
                .length(gridFSFile.getLength())
                .fileType(metadata != null && metadata.getString("fileType") != null ?
                        FileType.valueOf(metadata.getString("fileType")) : null)
                .title(metadata != null ? metadata.getString("title") : null)
                .description(metadata != null ? metadata.getString("description") : null)
                .tags(metadata != null ? (List<String>) metadata.get("tags") : new ArrayList<>())
                .uploadedAt(gridFSFile.getUploadDate())
                .uploadedBy(metadata != null ? metadata.getString("uploadedBy") : null)
                .build();
    }
}

