package com.gitquest.service;

import com.gitquest.model.User;
import com.gitquest.repository.ActivityRepository;
import com.gitquest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class StreakService {

    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final BadgeService badgeService;
    private final NotificationService notificationService;

    @Transactional
    public void updateStreak(User user) {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        long todayActivity = activityRepository.countByUserSince(user, startOfToday);

        if (todayActivity > 0) {
            LocalDateTime yesterday = LocalDate.now().minusDays(1).atStartOfDay();
            LocalDateTime startOfToday2 = LocalDate.now().atStartOfDay();

            boolean hadYesterdayActivity = activityRepository
                    .countByUserAndOccurredAtBetween(user, yesterday, startOfToday2) > 0
                    || user.getStreak() == 0;

            if (user.getLastActivityDate() == null ||
                    user.getLastActivityDate().toLocalDate().isBefore(LocalDate.now())) {
                user.setStreak(user.getStreak() + 1);
                user.setLastActivityDate(LocalDateTime.now());
                userRepository.save(user);

                if (user.getStreak() == 7 || user.getStreak() == 30 || user.getStreak() == 100) {
                    notificationService.sendStreakMilestoneNotification(user);
                }
                badgeService.checkStreakBadges(user);
            }
        }
    }

    @Scheduled(cron = "0 0 1 * * *") // 1 AM every day
    public void checkStreakBreaks() {
        LocalDateTime yesterday = LocalDate.now().minusDays(1).atStartOfDay();
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getStreak() > 0 && user.getLastActivityDate() != null
                    && user.getLastActivityDate().toLocalDate().isBefore(LocalDate.now().minusDays(1))) {
                user.setStreak(0);
                userRepository.save(user);
                log.info("Broke streak for user {}", user.getUsername());
            }
        }
    }


}
