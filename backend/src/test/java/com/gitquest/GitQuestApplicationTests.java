package com.gitquest;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.security.oauth2.client.registration.github.client-id=test",
    "spring.security.oauth2.client.registration.github.client-secret=test",
    "app.jwt.secret=test-secret-key-that-is-long-enough-for-hs256-signing"
})
class GitQuestApplicationTests {

    @Test
    void contextLoads() {
    }
}
