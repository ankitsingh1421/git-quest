package com.gitquest.service;

import com.gitquest.model.Badge;
import com.gitquest.model.Badge.BadgeType;
import com.gitquest.model.User;
import com.gitquest.repository.ActivityRepository;
import com.gitquest.repository.BadgeRepository;
import com.gitquest.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final ActivityRepository activityRepository;
    private final NotificationService notificationService;

    public List<Badge> getUserBadges(User user) {
        return badgeRepository.findByUserOrderByEarnedAtDesc(user);
    }

    @Transactional
    public void checkAndAwardBadges(User user) {
        checkCommitBadges(user);
        checkPrBadges(user);
        checkIssueBadges(user);
        checkLevelBadges(user);
    }

    @Transactional
    public void checkCommitBadges(User user) {
        long commits = activityRepository.countByUserAndType(user, Activity.ActivityType.COMMIT);
        if (commits >= 1) awardBadge(user, BadgeType.FIRST_COMMIT);
        if (commits >= 10) awardBadge(user, BadgeType.COMMITS_10);
        if (commits >= 50) awardBadge(user, BadgeType.COMMITS_50);
        if (commits >= 100) awardBadge(user, BadgeType.COMMITS_100);
    }

    @Transactional
    public void checkPrBadges(User user) {
        long prs = activityRepository.countByUserAndType(user, Activity.ActivityType.PR_OPENED);
        if (prs >= 1) awardBadge(user, BadgeType.FIRST_PR);
        long merged = activityRepository.countByUserAndType(user, Activity.ActivityType.PR_MERGED);
        if (merged >= 5) awardBadge(user, BadgeType.PR_MERGED_5);
    }

    @Transactional
    public void checkIssueBadges(User user) {
        long closed = activityRepository.countByUserAndType(user, Activity.ActivityType.ISSUE_CLOSED);
        if (closed >= 10) awardBadge(user, BadgeType.BUG_SLAYER);
    }

    @Transactional
    public void checkStreakBadges(User user) {
        if (user.getStreak() >= 7) awardBadge(user, BadgeType.STREAK_7);
        if (user.getStreak() >= 30) awardBadge(user, BadgeType.STREAK_30);
    }

    @Transactional
    public void checkLevelBadges(User user) {
        if (user.getLevel() >= 5) awardBadge(user, BadgeType.LEVEL_5);
        if (user.getLevel() >= 10) awardBadge(user, BadgeType.LEVEL_10);
        if (user.getLevel() >= 20) awardBadge(user, BadgeType.LEVEL_20);
    }

    private void awardBadge(User user, BadgeType type) {
        if (badgeRepository.existsByUserAndType(user, type)) return;
        Badge badge = Badge.builder().user(user).type(type).build();
        badgeRepository.save(badge);
        notificationService.sendBadgeNotification(user, type);
        log.info("Awarded badge {} to {}", type.getName(), user.getUsername());
    }
}
