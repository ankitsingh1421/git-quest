package com.gitquest.repository;

import com.gitquest.model.Activity;
import com.gitquest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserOrderByOccurredAtDesc(User user);
    List<Activity> findByUserAndTypeOrderByOccurredAtDesc(User user, Activity.ActivityType type);
    long countByUserAndType(User user, Activity.ActivityType type);
    boolean existsByGithubEventId(String githubEventId);

    @Query("SELECT COUNT(a) FROM Activity a WHERE a.user = :user AND a.occurredAt >= :since")
    long countByUserSince(User user, LocalDateTime since);

    @Query("SELECT COUNT(a) FROM Activity a WHERE a.user = :user AND a.type = :type AND a.occurredAt >= :since")
    long countByUserAndTypeSince(User user, Activity.ActivityType type, LocalDateTime since);

    List<Activity> findByUserAndOccurredAtBetweenOrderByOccurredAtDesc(
        User user, LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(a) FROM Activity a WHERE a.user = :user AND a.occurredAt BETWEEN :start AND :end")
    long countByUserAndOccurredAtBetween(User user, LocalDateTime start, LocalDateTime end);
}
