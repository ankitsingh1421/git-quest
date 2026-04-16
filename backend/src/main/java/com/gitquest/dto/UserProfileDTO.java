package com.gitquest.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Long id;
    private String username;
    private String name;
    private String avatarUrl;
    private Long xp;
    private Integer level;
    private Integer streak;
    private long xpInCurrentLevel;
    private long xpNeededForCurrentLevel;
    private int rank;
    private long totalCommits;
    private long totalPrs;
    private long totalIssues;
    private java.time.LocalDateTime createdAt;
}
