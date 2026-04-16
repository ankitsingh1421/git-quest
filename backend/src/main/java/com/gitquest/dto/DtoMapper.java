package com.gitquest.dto;

import com.gitquest.model.*;
import org.springframework.stereotype.Component;

// All DTO classes are in the same package — no explicit imports needed

@Component
public class DtoMapper {

    public UserProfileDTO toProfile(User user, int rank, long commits, long prs, long issues) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .xp(user.getXp())
                .level(user.getLevel())
                .streak(user.getStreak())
                .xpInCurrentLevel(user.xpInCurrentLevel())
                .xpNeededForCurrentLevel(user.xpNeededForCurrentLevel())
                .rank(rank)
                .totalCommits(commits)
                .totalPrs(prs)
                .totalIssues(issues)
                .createdAt(user.getCreatedAt())
                .build();
    }

    public ActivityDTO toActivity(Activity a) {
        return ActivityDTO.builder()
                .id(a.getId())
                .type(a.getType().name())
                .displayName(a.getType().getDisplayName())
                .repoName(a.getRepoName())
                .description(a.getDescription())
                .xpEarned(a.getXpEarned())
                .occurredAt(a.getOccurredAt())
                .build();
    }

    public BadgeDTO toBadge(Badge b) {
        return BadgeDTO.builder()
                .id(b.getId())
                .type(b.getType().name())
                .name(b.getType().getName())
                .description(b.getType().getDescription())
                .emoji(b.getType().getEmoji())
                .earnedAt(b.getEarnedAt())
                .build();
    }

    public QuestDTO toQuest(Quest q) {
        return QuestDTO.builder()
                .id(q.getId())
                .type(q.getType().name())
                .description(q.getType().getDescription())
                .targetCount(q.getTargetCount())
                .currentCount(q.getCurrentCount())
                .xpReward(q.getXpReward())
                .completed(q.isCompleted())
                .progressPercent(q.getProgressPercent())
                .expiresAt(q.getExpiresAt())
                .completedAt(q.getCompletedAt())
                .build();
    }

    public NotificationDTO toNotification(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .type(n.getType().name())
                .title(n.getTitle())
                .message(n.getMessage())
                .emoji(n.getEmoji())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
