package com.gitquest.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDTO {
    private int rank;
    private Long userId;
    private String username;
    private String name;
    private String avatarUrl;
    private Long xp;
    private Integer level;
    private Integer streak;
}
