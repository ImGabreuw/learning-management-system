package com.metis.backend.files.models.responses;

import com.metis.backend.files.models.enums.FileType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileResponse {

    private String id;

    private String filename;
    private String originalName;
    private String contentType;
    private Long length;
    private FileType fileType;

    private String title;
    private String description;

    private List<String> tags;

    private Date uploadedAt;
    private String uploadedBy;

}
