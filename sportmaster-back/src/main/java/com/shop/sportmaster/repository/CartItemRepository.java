package com.shop.sportmaster.repository;

import com.shop.sportmaster.model.CartItem;
import com.shop.sportmaster.model.Product;
import com.shop.sportmaster.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProduct(User user, Product product);


    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);
    void deleteByUser(User user);
    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.product.id IN :productIds")
    void deleteByProductIds(@Param("productIds") List<Long> productIds);
}


