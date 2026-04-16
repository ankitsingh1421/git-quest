package com.gitquest.service;

import com.gitquest.model.*;
import com.gitquest.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestService {

    private final QuestRepository questRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final XpService xpService;
    private final NotificationService notificationService;
    private final Random random = new Random();

    public List<Quest> getUserQuests(User user) {
        return questRepository.findByUserOrderByAssignedAtDesc(user);
    }

    public List<Quest> getActiveQuests(User user) {
        return questRepository.findByUserAndCompleted(user, false);
    }

    @Transactional
    public void assignDailyQuests(User user) {
        List<Quest> activeQuests = questRepository.findByUserAndCompleted(user, false);
        if (activeQuests.size() >= 3) return;

        Quest.QuestType[] dailyTypes = {
            Quest.QuestType.DAILY_COMMITS,
            Quest.QuestType.DAILY_ISSUES,
            Quest.QuestType.DAILY_STREAK
        };

        Quest.QuestType[] weeklyTypes = {
            Quest.QuestType.WEEKLY_PRS,
            Quest.QuestType.WEEKLY_REVIEWS
        };

        Quest dailyQuest = Quest.builder()
                .user(user)
                .type(dailyTypes[random.nextInt(dailyTypes.length)])
                .targetCount(0)
                .currentCount(0)
                .completed(false)
                .expiresAt(LocalDate.now().plusDays(1).atStartOfDay())
                .build();
        dailyQuest.setTargetCount(dailyQuest.getType().getTarget());
        dailyQuest.setXpReward(dailyQuest.getType().getXpReward());
        questRepository.save(dailyQuest);

        Quest weeklyQuest = Quest.builder()
                .user(user)
                .type(weeklyTypes[random.nextInt(weeklyTypes.length)])
                .targetCount(0)
                .currentCount(0)
                .completed(false)
                .expiresAt(LocalDate.now().plusWeeks(1).atStartOfDay())
                .build();
        weeklyQuest.setTargetCount(weeklyQuest.getType().getTarget());
        weeklyQuest.setXpReward(weeklyQuest.getType().getXpReward());
        questRepository.save(weeklyQuest);
    }

    @Transactional
    public void checkQuestProgress(User user) {
        List<Quest> activeQuests = questRepository.findByUserAndCompleted(user, false);
        LocalDateTime dayStart = LocalDate.now().atStartOfDay();
        LocalDateTime weekStart = LocalDate.now().minusDays(LocalDate.now().getDayOfWeek().getValue() - 1).atStartOfDay();

        for (Quest quest : activeQuests) {
            if (quest.getExpiresAt() != null && LocalDateTime.now().isAfter(quest.getExpiresAt())) {
                quest.setCompleted(true);
                questRepository.save(quest);
                continue;
            }

            Activity.ActivityType actType = quest.getType().getActivityType();
            if (actType == null) continue;

            LocalDateTime since = quest.getExpiresAt() != null
                    && quest.getExpiresAt().isBefore(dayStart.plusDays(1)) ? dayStart : weekStart;

            long count = activityRepository.countByUserAndTypeSince(user, actType, since);
            quest.setCurrentCount((int) count);

            if (count >= quest.getTargetCount()) {
                quest.setCompleted(true);
                quest.setCompletedAt(LocalDateTime.now());
                questRepository.save(quest);
                xpService.awardXp(user, quest.getXpReward(), "Quest: " + quest.getType().getDescription());
                notificationService.sendQuestCompleteNotification(user, quest);
                log.info("Quest completed: {} for {}", quest.getType().getDescription(), user.getUsername());
            } else {
                questRepository.save(quest);
            }
        }
    }

    @Scheduled(cron = "0 0 0 * * *") // midnight every day
    public void assignDailyQuestsToAll() {
        List<User> users = userRepository.findAll();
        users.forEach(this::assignDailyQuests);
    }
}
