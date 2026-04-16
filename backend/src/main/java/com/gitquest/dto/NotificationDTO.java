package com.gitquest.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private String type;
    private String title;
    private String message;
    private String emoji;
    private boolean read;
    private LocalDateTime createdAt;
}
