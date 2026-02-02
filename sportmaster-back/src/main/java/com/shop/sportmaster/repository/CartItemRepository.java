package com.shop.sportmaster.repository;

import com.shop.sportmaster.model.CartItem;
import com.shop.sportmaster.model.Product;
import com.shop.sportmaster.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProduct(User user, Product product);

    void deleteByUser(User user);
}


