package com.gitquest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.gitquest.model.Activity;
import com.gitquest.model.User;
import com.gitquest.repository.ActivityRepository;
import com.gitquest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitHubActivityService {

    private final WebClient githubWebClient;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final XpService xpService;
    private final StreakService streakService;
    private final QuestService questService;

    public List<Activity> getUserActivities(User user) {
        return activityRepository.findByUserOrderByOccurredAtDesc(user);
    }

    public void syncUserActivity(User user) {
        if (user.getGithubToken() == null) {
            log.warn("No token for user {}, skipping sync", user.getUsername());
            return;
        }
        fetchAndProcessEvents(user);
    }

    private void fetchAndProcessEvents(User user) {
        try {
            JsonNode events = githubWebClient.get()
                    .uri("/users/{username}/events?per_page=30", user.getUsername())
                    .header("Authorization", "Bearer " + user.getGithubToken())
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            if (events == null || !events.isArray()) return;

            for (JsonNode event : events) {
                processEvent(user, event);
            }

            streakService.updateStreak(user);
            questService.checkQuestProgress(user);

        } catch (Exception e) {
            log.error("Failed to sync GitHub activity for {}: {}", user.getUsername(), e.getMessage());
        }
    }

    private void processEvent(User user, JsonNode event) {
        String eventId = event.path("id").asText();
        String eventType = event.path("type").asText();
        String repoName = event.path("repo").path("name").asText();

        if (activityRepository.existsByGithubEventId(eventId)) return;

        Activity.ActivityType activityType = mapEventType(eventType, event);
        if (activityType == null) return;

        Activity activity = Activity.builder()
                .user(user)
                .type(activityType)
                .repoName(repoName)
                .description(buildDescription(eventType, event))
                .xpEarned((long) activityType.getXpValue())
                .githubEventId(eventId)
                .occurredAt(LocalDateTime.now())
                .build();

        activityRepository.save(activity);
        xpService.awardXp(user, activityType.getXpValue(), activityType.getDisplayName());
    }

    private Activity.ActivityType mapEventType(String eventType, JsonNode event) {
        return switch (eventType) {
            case "PushEvent" -> Activity.ActivityType.COMMIT;
            case "PullRequestEvent" -> {
                String action = event.path("payload").path("action").asText();
                if ("opened".equals(action)) yield Activity.ActivityType.PR_OPENED;
                if ("closed".equals(action) && event.path("payload").path("pull_request").path("merged").asBoolean())
                    yield Activity.ActivityType.PR_MERGED;
                yield null;
            }
            case "IssuesEvent" -> {
                String action = event.path("payload").path("action").asText();
                if ("opened".equals(action)) yield Activity.ActivityType.ISSUE_OPENED;
                if ("closed".equals(action)) yield Activity.ActivityType.ISSUE_CLOSED;
                yield null;
            }
            case "PullRequestReviewEvent" -> Activity.ActivityType.CODE_REVIEW;
            default -> null;
        };
    }

    private String buildDescription(String eventType, JsonNode event) {
        return switch (eventType) {
            case "PushEvent" -> {
                int commits = event.path("payload").path("commits").size();
                yield "Pushed " + commits + " commit(s)";
            }
            case "PullRequestEvent" -> {
                String title = event.path("payload").path("pull_request").path("title").asText();
                yield "PR: " + title;
            }
            case "IssuesEvent" -> {
                String title = event.path("payload").path("issue").path("title").asText();
                yield "Issue: " + title;
            }
            default -> eventType;
        };
    }

    @Scheduled(fixedDelay = 1800000) // every 30 minutes
    public void syncAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(this::syncUserActivity);
        log.info("Synced activity for {} users", users.size());
    }

    public long getCommitCount(User user) {
        return activityRepository.countByUserAndType(user, Activity.ActivityType.COMMIT);
    }

    public long getPrCount(User user) {
        return activityRepository.countByUserAndType(user, Activity.ActivityType.PR_MERGED);
    }

    public long getIssueCount(User user) {
        return activityRepository.countByUserAndType(user, Activity.ActivityType.ISSUE_CLOSED);
    }
}
