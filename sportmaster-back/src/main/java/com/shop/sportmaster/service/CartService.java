package com.shop.sportmaster.service;

import com.shop.sportmaster.model.CartItem;
import com.shop.sportmaster.model.Product;
import com.shop.sportmaster.model.User;
import com.shop.sportmaster.repository.CartItemRepository;
import com.shop.sportmaster.repository.ProductRepository;
import com.shop.sportmaster.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public void addToCart(User user, Long productId, int quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        CartItem cartItem = cartItemRepository
                .findByUserAndProduct(user, product)
                .orElseGet(() -> {
                    CartItem ci = new CartItem();
                    ci.setUser(user);
                    ci.setProduct(product);
                    ci.setQuantity(0);
                    return ci;
                });

        int newQuantity = cartItem.getQuantity() + quantity;

        if (product.getStock() < newQuantity) {
            throw new RuntimeException("Недостаточно товара на складе");
        }

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);
    }

    public List<CartItem> getCart(User user) {
        return cartItemRepository.findByUser(user);
    }

    public void removeFromCart(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow();

        cartItemRepository.findByUserAndProduct(user, product)
                .ifPresent(cartItemRepository::delete);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }
}

