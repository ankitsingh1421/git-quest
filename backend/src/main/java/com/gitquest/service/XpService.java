package com.gitquest.service;

import com.gitquest.model.User;
import com.gitquest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class XpService {

    private final UserRepository userRepository;
    private final BadgeService badgeService;
    private final NotificationService notificationService;

    @Transactional
    public void awardXp(User user, long amount, String reason) {
        int oldLevel = user.getLevel();
        user.addXp(amount);
        userRepository.save(user);

        notificationService.sendXpNotification(user, amount, reason);

        if (user.getLevel() > oldLevel) {
            notificationService.sendLevelUpNotification(user);
            badgeService.checkLevelBadges(user);
        }

        log.info("Awarded {}XP to {} for {}. Total: {}XP, Level: {}",
                amount, user.getUsername(), reason, user.getXp(), user.getLevel());
    }
}
