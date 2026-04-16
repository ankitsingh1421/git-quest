package com.gitquest.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BadgeDTO {
    private Long id;
    private String type;
    private String name;
    private String description;
    private String emoji;
    private LocalDateTime earnedAt;
}
