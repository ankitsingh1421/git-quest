package com.gitquest.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private QuestType type;

    private int targetCount;
    private int currentCount;
    private Long xpReward;
    private boolean completed;

    @Builder.Default
    private LocalDateTime assignedAt = LocalDateTime.now();
    private LocalDateTime completedAt;
    private LocalDateTime expiresAt;

    public enum QuestType {
        DAILY_COMMITS("Make 5 commits today", 5, Activity.ActivityType.COMMIT, 100L),
        WEEKLY_PRS("Open 2 PRs this week", 2, Activity.ActivityType.PR_OPENED, 200L),
        DAILY_ISSUES("Close 3 issues today", 3, Activity.ActivityType.ISSUE_CLOSED, 150L),
        WEEKLY_REVIEWS("Do 5 code reviews this week", 5, Activity.ActivityType.CODE_REVIEW, 250L),
        DAILY_STREAK("Contribute every day for 3 days", 3, null, 300L);

        private final String description;
        private final int target;
        private final Activity.ActivityType activityType;
        private final Long xpReward;

        QuestType(String description, int target, Activity.ActivityType activityType, Long xpReward) {
            this.description = description;
            this.target = target;
            this.activityType = activityType;
            this.xpReward = xpReward;
        }

        public String getDescription() { return description; }
        public int getTarget() { return target; }
        public Activity.ActivityType getActivityType() { return activityType; }
        public Long getXpReward() { return xpReward; }
    }

    public int getProgressPercent() {
        if (targetCount == 0) return 0;
        return Math.min(100, (currentCount * 100) / targetCount);
    }
}
