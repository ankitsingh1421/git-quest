package com.gitquest.controller;

import com.gitquest.dto.*;
import com.gitquest.model.User;
import com.gitquest.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeService badgeService;
    private final UserService userService;
    private final DtoMapper mapper;

    @GetMapping
    public ResponseEntity<List<BadgeDTO>> getBadges(Authentication auth) {
        User user = userService.getCurrentUser(auth.getName());
        List<BadgeDTO> dtos = badgeService.getUserBadges(user)
                .stream().map(mapper::toBadge).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
