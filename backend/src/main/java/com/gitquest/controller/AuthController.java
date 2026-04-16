package com.gitquest.controller;

import com.gitquest.dto.DtoMapper;
import com.gitquest.model.User;
import com.gitquest.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final LeaderboardService leaderboardService;
    private final GitHubActivityService activityService;
    private final DtoMapper mapper;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication auth) {
        User user = userService.getCurrentUser(auth.getName());
        int rank = leaderboardService.getUserRank(user);
        long commits = activityService.getCommitCount(user);
        long prs = activityService.getPrCount(user);
        long issues = activityService.getIssueCount(user);
        return ResponseEntity.ok(mapper.toProfile(user, rank, commits, prs, issues));
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncActivity(Authentication auth) {
        User user = userService.getCurrentUser(auth.getName());
        activityService.syncUserActivity(user);
        return ResponseEntity.ok(Map.of("message", "Sync triggered"));
    }
}
