package com.shop.sportmaster.service;

import com.shop.sportmaster.dto.LoginRequest;
import com.shop.sportmaster.dto.RegisterRequest;
import com.shop.sportmaster.model.Profile;
import com.shop.sportmaster.model.Role;
import com.shop.sportmaster.model.User;
import com.shop.sportmaster.repository.RoleRepository;
import com.shop.sportmaster.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Регистрация нового пользователя
     */
    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> roleRepository.save(new Role("USER")));

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        Profile profile = new Profile();
        profile.setFullName(request.getFullName());
        profile.setEmail(request.getEmail());

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setRole(userRole);
        user.setGuest(false);
        user.setEnabled(true);
        user.setProfile(profile);

        return userRepository.save(user);
    }

    /**
     * Аутентификация существующего пользователя (без установки сессии!)
     * Возвращает пользователя, если данные верны.
     */
    public User login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Неверный email или пароль");
        }

        User user = userOpt.get();

        // Гости не могут входить через /login
        if (user.isGuest()) {
            throw new RuntimeException("Неверный email или пароль");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Аккаунт заблокирован");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Неверный email или пароль");
        }

        return user;
    }

    /**
     * Создание гостевого пользователя (для оформления заказа без регистрации)
     */
    @Transactional
    public User createGuestUser(Profile profile) {
        if (profile.getEmail() == null || profile.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email обязателен даже для гостей");
        }

        // Проверяем, не зарегистрирован ли уже такой email
        if (userRepository.findByEmail(profile.getEmail()).isPresent()) {
            // Можно либо вернуть существующего, либо запретить — здесь запрещаем
            throw new RuntimeException("Пользователь с таким email уже существует. Войдите в аккаунт.");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> roleRepository.save(new Role("USER")));

        String randomPassword = java.util.UUID.randomUUID().toString();
        String encodedPassword = passwordEncoder.encode(randomPassword);

        User guest = new User();
        guest.setEmail(profile.getEmail());
        guest.setPassword(encodedPassword);
        guest.setRole(userRole);
        guest.setGuest(true);
        guest.setEnabled(true);
        guest.setProfile(profile);

        return userRepository.save(guest);
    }
}