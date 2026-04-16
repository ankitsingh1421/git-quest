package com.gitquest.repository;

import com.gitquest.model.Notification;
import com.gitquest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserAndReadFalseOrderByCreatedAtDesc(User user);
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    long countByUserAndReadFalse(User user);
}
