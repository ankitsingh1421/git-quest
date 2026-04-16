package com.gitquest.controller;

import com.gitquest.dto.*;
import com.gitquest.model.User;
import com.gitquest.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;
    private final DtoMapper mapper;

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(Authentication auth) {
        User user = userService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(notificationService.getAllNotifications(user)
                .stream().map(mapper::toNotification).collect(Collectors.toList()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication auth) {
        User user = userService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(user)));
    }

    @PostMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllRead(Authentication auth) {
        User user = userService.getCurrentUser(auth.getName());
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
