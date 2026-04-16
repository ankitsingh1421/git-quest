package com.gitquest.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ActivityDTO {
    private Long id;
    private String type;
    private String displayName;
    private String repoName;
    private String description;
    private Long xpEarned;
    private LocalDateTime occurredAt;
}
