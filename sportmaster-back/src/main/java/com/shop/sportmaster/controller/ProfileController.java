package com.shop.sportmaster.controller;

import com.shop.sportmaster.dto.ProfileResponse;
import com.shop.sportmaster.dto.ProfileUpdateRequest;
import com.shop.sportmaster.model.Profile;
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


    @PatchMapping
    public User updateProfile(@RequestBody ProfileUpdateRequest request, Authentication authentication) {
        return userService.updateProfile(request, authentication);
    }
    @GetMapping
    public ProfileResponse getProfile(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        Profile profile = user.getProfile();

        ProfileResponse response = new ProfileResponse();
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().getName());
        if (profile != null) {
            response.setFullName(profile.getFullName());
            response.setCity(profile.getCity());
            response.setCountry(profile.getCountry());
            response.setPhone(profile.getPhone());
        }
        return response;
    }
}