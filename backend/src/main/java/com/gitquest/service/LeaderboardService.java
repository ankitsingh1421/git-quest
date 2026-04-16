package com.gitquest.service;

import com.gitquest.dto.LeaderboardEntryDTO;
import com.gitquest.model.User;
import com.gitquest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;

    @Cacheable(value = "leaderboard", key = "'top50'")
    public List<LeaderboardEntryDTO> getTopUsers() {
        List<User> users = userRepository.findAllOrderByXpDesc();
        AtomicInteger rank = new AtomicInteger(1);
        return users.stream()
                .limit(50)
                .map(u -> LeaderboardEntryDTO.builder()
                        .rank(rank.getAndIncrement())
                        .userId(u.getId())
                        .username(u.getUsername())
                        .name(u.getName())
                        .avatarUrl(u.getAvatarUrl())
                        .xp(u.getXp())
                        .level(u.getLevel())
                        .streak(u.getStreak())
                        .build())
                .collect(Collectors.toList());
    }

    public int getUserRank(User user) {
        List<User> users = userRepository.findAllOrderByXpDesc();
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId().equals(user.getId())) return i + 1;
        }
        return -1;
    }
}
