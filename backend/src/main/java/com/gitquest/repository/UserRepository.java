package com.gitquest.repository;

import com.gitquest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByGithubId(String githubId);
    Optional<User> findByUsername(String username);
    boolean existsByGithubId(String githubId);

    @Query("SELECT u FROM User u ORDER BY u.xp DESC")
    List<User> findAllOrderByXpDesc();

    @Query("SELECT u FROM User u ORDER BY u.xp DESC LIMIT :limit")
    List<User> findTopByXp(int limit);
}
