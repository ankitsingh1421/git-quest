package com.gitquest.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "badges")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private BadgeType type;

    @Builder.Default
    private LocalDateTime earnedAt = LocalDateTime.now();

    public enum BadgeType {
        FIRST_COMMIT("First Commit", "Made your first commit!", "🌱"),
        COMMITS_10("10 Commits", "10 commits made", "🔥"),
        COMMITS_50("50 Commits", "50 commits made", "⚡"),
        COMMITS_100("100 Commits", "100 commits club", "💯"),
        FIRST_PR("First PR", "Opened your first Pull Request", "🚀"),
        PR_MERGED_5("PR Pro", "5 PRs merged", "🏅"),
        BUG_SLAYER("Bug Slayer", "Closed 10 issues", "🐛"),
        STREAK_7("Week Warrior", "7 day streak", "📅"),
        STREAK_30("Month Master", "30 day streak", "🗓️"),
        LEVEL_5("Level 5", "Reached level 5", "⭐"),
        LEVEL_10("Level 10", "Reached level 10", "🌟"),
        LEVEL_20("Level 20", "Reached level 20", "💫"),
        EARLY_BIRD("Early Bird", "Joined in the first month", "🐦"),
        NIGHT_OWL("Night Owl", "Committed after midnight", "🦉"),
        QUEST_MASTER("Quest Master", "Completed 10 quests", "🎯");

        private final String name;
        private final String description;
        private final String emoji;

        BadgeType(String name, String description, String emoji) {
            this.name = name;
            this.description = description;
            this.emoji = emoji;
        }

        public String getName() { return name; }
        public String getDescription() { return description; }
        public String getEmoji() { return emoji; }
    }
}
