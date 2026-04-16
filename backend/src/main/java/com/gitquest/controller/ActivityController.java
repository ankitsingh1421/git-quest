package com.gitquest.controller;

import com.gitquest.dto.*;
import com.gitquest.model.*;
import com.gitquest.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final GitHubActivityService activityService;
    private final UserService userService;
    private final DtoMapper mapper;

    @GetMapping
    public ResponseEntity<List<ActivityDTO>> getActivities(Authentication auth) {
        User user = userService.getCurrentUser(auth.getName());
        List<ActivityDTO> dtos = activityService.getUserActivities(user)
                .stream().map(mapper::toActivity).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
