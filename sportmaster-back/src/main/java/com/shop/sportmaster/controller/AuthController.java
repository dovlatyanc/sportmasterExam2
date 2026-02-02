package com.shop.sportmaster.controller;

import com.shop.sportmaster.dto.LoginRequest;
import com.shop.sportmaster.dto.RegisterRequest;
import com.shop.sportmaster.model.User;
import com.shop.sportmaster.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        User user = authService.register(request);

        // Опционально: автоматически логиним после регистрации
        // authenticateUser(user.getEmail(), httpRequest);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        User user = authService.login(request); // должен бросать исключение при ошибке

        // 🔑 Аутентифицируем пользователя в Spring Security
        authenticateUser(user.getEmail(), httpRequest);

        return ResponseEntity.ok().build();
    }

    // Вспомогательный метод: устанавливает аутентификацию в сессию
    private void authenticateUser(String email, HttpServletRequest request) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                email,
                null,
                AuthorityUtils.createAuthorityList("ROLE_USER")
        );

        SecurityContext context = SecurityContextHolder.getContext();
        context.setAuthentication(auth);


        HttpSession session = request.getSession(true);
        session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                context
        );
    }
}