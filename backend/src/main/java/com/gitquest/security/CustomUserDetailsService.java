package com.gitquest.security;

import com.gitquest.model.User;
import com.gitquest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        User user = userRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + id));

        return new org.springframework.security.core.userdetails.User(
                String.valueOf(user.getId()),
                "",
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
