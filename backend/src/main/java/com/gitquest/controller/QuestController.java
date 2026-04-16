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
@RequestMapping("/api/quests")
@RequiredArgsConstructor
public class QuestController {

    private final QuestService questService;
    private final UserService userService;
    private final DtoMapper mapper;

    @GetMapping
    public ResponseEntity<List<QuestDTO>> getQuests(Authentication auth) {
        User user = userService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(questService.getUserQuests(user)
                .stream().map(mapper::toQuest).collect(Collectors.toList()));
    }

    @GetMapping("/active")
    public ResponseEntity<List<QuestDTO>> getActiveQuests(Authentication auth) {
        User user = userService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(questService.getActiveQuests(user)
                .stream().map(mapper::toQuest).collect(Collectors.toList()));
    }
}
