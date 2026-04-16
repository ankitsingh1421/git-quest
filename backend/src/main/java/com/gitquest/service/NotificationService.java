package com.gitquest.service;

import com.gitquest.model.*;
import com.gitquest.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndReadFalseOrderByCreatedAtDesc(user);
    }

    public List<Notification> getAllNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }

    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserAndReadFalseOrderByCreatedAtDesc(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public void sendLevelUpNotification(User user) {
        save(user, Notification.NotificationType.LEVEL_UP,
                "Level Up! 🎉",
                "You reached Level " + user.getLevel() + "! Keep going!",
                "⬆️");
    }

    public void sendBadgeNotification(User user, Badge.BadgeType badgeType) {
        save(user, Notification.NotificationType.BADGE_UNLOCK,
                "Badge Unlocked!",
                badgeType.getEmoji() + " " + badgeType.getName() + " — " + badgeType.getDescription(),
                "🏆");
    }

    public void sendStreakMilestoneNotification(User user) {
        save(user, Notification.NotificationType.STREAK_MILESTONE,
                "Streak Milestone! 🔥",
                "Amazing! You've maintained a " + user.getStreak() + "-day streak!",
                "🔥");
    }

    public void sendQuestCompleteNotification(User user, Quest quest) {
        save(user, Notification.NotificationType.QUEST_COMPLETE,
                "Quest Complete! 🎯",
                "You completed: " + quest.getType().getDescription() + " (+"+quest.getXpReward()+" XP)",
                "🎯");
    }

    public void sendXpNotification(User user, long amount, String reason) {
        save(user, Notification.NotificationType.XP_EARNED,
                "+" + amount + " XP",
                reason,
                "✨");
    }

    private void save(User user, Notification.NotificationType type, String title, String message, String emoji) {
        Notification n = Notification.builder()
                .user(user).type(type).title(title).message(message).emoji(emoji).build();
        notificationRepository.save(n);
    }
}
