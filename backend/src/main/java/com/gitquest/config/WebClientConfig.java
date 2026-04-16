package com.gitquest.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${github.api.base-url}")
    private String githubBaseUrl;

    @Bean
    public WebClient githubWebClient() {
        return WebClient.builder()
                .baseUrl(githubBaseUrl)
                .defaultHeader("Accept", "application/vnd.github.v3+json")
                .defaultHeader("X-GitHub-Api-Version", "2022-11-28")
                .build();
    }
}
