// src/main/java/com/shop/sportmaster/controller/AdminUserController.java
package com.shop.sportmaster.controller;

import com.shop.sportmaster.model.User;
import com.shop.sportmaster.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}/disable")
    public User disableUser(@PathVariable Long id) {
        return userService.disableUser(id); // блокировка
    }

    @PutMapping("/{id}/enable")
    public User enableUser(@PathVariable Long id) {
        return userService.enableUser(id); // разблокировка
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id); // полное удаление
    }
}