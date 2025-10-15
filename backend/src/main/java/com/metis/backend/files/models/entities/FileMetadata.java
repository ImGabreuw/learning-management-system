package com.metis.backend.files.models.entities;

import com.metis.backend.files.models.enums.FileType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileMetadata {

    private FileType fileType;

    private String title;
    private String description;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    private LocalDateTime uploadedAt;
    private String uploadedBy;

    public boolean hasTag(String tag) {
        if (tags == null) {
            return false;
        }
        return tags
                .stream()
                .anyMatch(t -> t.equalsIgnoreCase(tag));
    }

}
