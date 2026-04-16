package com.gitquest.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String title;
    private String message;
    private String emoji;

    @Builder.Default
    private boolean read = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum NotificationType {
        LEVEL_UP, BADGE_UNLOCK, STREAK_MILESTONE, QUEST_COMPLETE, XP_EARNED
    }
}
