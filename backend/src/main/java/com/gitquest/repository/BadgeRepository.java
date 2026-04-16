package com.gitquest.repository;

import com.gitquest.model.Badge;
import com.gitquest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    List<Badge> findByUser(User user);
    boolean existsByUserAndType(User user, Badge.BadgeType type);
    List<Badge> findByUserOrderByEarnedAtDesc(User user);
}
