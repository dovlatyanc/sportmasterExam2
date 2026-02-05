package com.shop.sportmaster.controller;

import com.shop.sportmaster.dto.GuestOrderRequest;
import com.shop.sportmaster.model.Order;
import com.shop.sportmaster.model.User;
import com.shop.sportmaster.service.OrderService;
import com.shop.sportmaster.service.UserService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor

public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @PostMapping
    public Order createOrder(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        return orderService.createOrder(user);
    }

    @GetMapping
    public List<Order> myOrders(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        return orderService.getUserOrders(user);
    }




    @PostMapping("/guest")
    @PermitAll
    public Order createGuestOrder(@RequestBody GuestOrderRequest request) {
        return orderService.createGuestOrder(request);
    }
}