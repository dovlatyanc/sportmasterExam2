package com.shop.sportmaster.controller;

import com.shop.sportmaster.model.User;
import com.shop.sportmaster.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    @GetMapping
    public User getProfile(Authentication authentication) {
        return userService.getCurrentUser(authentication);
    }
}