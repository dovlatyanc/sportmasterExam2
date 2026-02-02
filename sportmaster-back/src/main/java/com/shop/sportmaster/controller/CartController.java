package com.shop.sportmaster.controller;

import com.shop.sportmaster.model.CartItem;
import com.shop.sportmaster.model.Product;
import com.shop.sportmaster.model.User;
import com.shop.sportmaster.repository.CartItemRepository;
import com.shop.sportmaster.repository.ProductRepository;
import com.shop.sportmaster.repository.UserRepository;
import com.shop.sportmaster.service.CartService;
import com.shop.sportmaster.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    @PostMapping("/add")
    public void addToCart(
            @RequestParam Long productId,
            @RequestParam int quantity,
            Authentication authentication
    ) {
        User user = userService.getCurrentUser(authentication);
        cartService.addToCart(user, productId, quantity);
    }

    @GetMapping
    public List<CartItem> getCart(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        return cartService.getCart(user);
    }

    @DeleteMapping("/remove")
    public void remove(
            @RequestParam Long productId,
            Authentication authentication
    ) {
        User user = userService.getCurrentUser(authentication);
        cartService.removeFromCart(user, productId);
    }

    @DeleteMapping("/clear")
    public void clear(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        cartService.clearCart(user);
    }
}