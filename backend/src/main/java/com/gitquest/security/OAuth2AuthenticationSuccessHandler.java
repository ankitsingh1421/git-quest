package com.gitquest.security;

import com.gitquest.model.User;
import com.gitquest.repository.UserRepository;
import com.gitquest.service.QuestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final QuestService questService;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String githubId = String.valueOf(attributes.get("id"));
        String username = (String) attributes.get("login");
        String name = (String) attributes.getOrDefault("name", username);
        String email = (String) attributes.getOrDefault("email", "");
        String avatarUrl = (String) attributes.getOrDefault("avatar_url", "");

        User user = userRepository.findByGithubId(githubId).orElseGet(() -> {
            User newUser = User.builder()
                    .githubId(githubId)
                    .username(username)
                    .name(name)
                    .email(email)
                    .avatarUrl(avatarUrl)
                    .build();
            User saved = userRepository.save(newUser);
            questService.assignDailyQuests(saved);
            return saved;
        });

        user.setName(name);
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

        String token = tokenProvider.generateToken(String.valueOf(user.getId()));
        String targetUrl = redirectUri + "?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
