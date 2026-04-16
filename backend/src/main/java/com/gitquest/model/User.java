package com.gitquest.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String githubId;

    @Column(unique = true, nullable = false)
    private String username;

    private String name;
    private String email;
    private String avatarUrl;
    private String githubToken;

    @Column(nullable = false)
    @Builder.Default
    private Long xp = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Integer level = 1;

    @Column(nullable = false)
    @Builder.Default
    private Integer streak = 0;

    private LocalDateTime lastActivityDate;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Badge> badges = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Notification> notifications = new ArrayList<>();

    public void addXp(long amount) {
        this.xp += amount;
        this.level = calculateLevel(this.xp);
    }

    public static int calculateLevel(long xp) {
        return (int) (Math.floor(Math.sqrt(xp / 100.0))) + 1;
    }

    public long xpForNextLevel() {
        long nextLevel = this.level;
        return (nextLevel * nextLevel) * 100;
    }

    public long xpInCurrentLevel() {
        long prevLevel = this.level - 1;
        return this.xp - (prevLevel * prevLevel * 100);
    }

    public long xpNeededForCurrentLevel() {
        long prevLevel = this.level - 1;
        long nextLevel = this.level;
        return (nextLevel * nextLevel * 100) - (prevLevel * prevLevel * 100);
    }
}
