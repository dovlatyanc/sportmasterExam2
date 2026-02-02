package com.shop.sportmaster.service;

import com.shop.sportmaster.dto.GuestOrderRequest;
import com.shop.sportmaster.model.Profile;
import com.shop.sportmaster.model.Role;
import com.shop.sportmaster.repository.RoleRepository;
import org.springframework.security.core.Authentication;
import com.shop.sportmaster.model.User;
import com.shop.sportmaster.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    public User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName(); // username = email
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    public User createGuestUser(GuestOrderRequest dto) {

        // если гость с таким email уже был — используем его
        return userRepository.findByEmail(dto.getEmail())
                .orElseGet(() -> {

                    Role userRole = roleRepository.findByName("ROLE_USER")
                            .orElseThrow();

                    User user = new User();
                    user.setEmail(dto.getEmail());
                    user.setPassword(""); // 👈 пустой пароль
                    user.setGuest(true);
                    user.setEnabled(true);
                    user.setRole(userRole);

                    Profile profile = new Profile();
                    profile.setFullName(dto.getFullName());
                    profile.setCity(dto.getCity());
                    profile.setCountry(dto.getCountry());
                    profile.setPhone(dto.getPhone());

                    user.setProfile(profile); // двусторонняя связь

                    return userRepository.save(user);
                });
    }
}
