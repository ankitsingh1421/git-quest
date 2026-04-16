package com.gitquest.repository;

import com.gitquest.model.Quest;
import com.gitquest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestRepository extends JpaRepository<Quest, Long> {
    List<Quest> findByUserAndCompleted(User user, boolean completed);
    List<Quest> findByUserOrderByAssignedAtDesc(User user);
    long countByUserAndCompleted(User user, boolean completed);
}
