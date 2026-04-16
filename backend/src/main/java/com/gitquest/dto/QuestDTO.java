package com.gitquest.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class QuestDTO {
    private Long id;
    private String type;
    private String description;
    private int targetCount;
    private int currentCount;
    private Long xpReward;
    private boolean completed;
    private int progressPercent;
    private LocalDateTime expiresAt;
    private LocalDateTime completedAt;
}
