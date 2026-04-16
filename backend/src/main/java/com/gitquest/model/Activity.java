package com.gitquest.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private ActivityType type;

    private String repoName;
    private String description;
    private Long xpEarned;
    private String githubEventId;

    @Builder.Default
    private LocalDateTime occurredAt = LocalDateTime.now();

    public enum ActivityType {
        COMMIT(10, "Commit"),
        PR_OPENED(20, "Pull Request Opened"),
        PR_MERGED(50, "Pull Request Merged"),
        ISSUE_OPENED(15, "Issue Opened"),
        ISSUE_CLOSED(30, "Issue Closed"),
        CODE_REVIEW(25, "Code Review"),
        STAR_GIVEN(5, "Starred Repo");

        private final int xpValue;
        private final String displayName;

        ActivityType(int xpValue, String displayName) {
            this.xpValue = xpValue;
            this.displayName = displayName;
        }

        public int getXpValue() { return xpValue; }
        public String getDisplayName() { return displayName; }
    }
}
