package com.shop.sportmaster.repository;

import com.shop.sportmaster.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository
        extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> {

    List<Product> findByCategoryId(Long categoryId);
    void deleteByCategoryId(Long categoryId);
    long count();

    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR p.name ILIKE %:name%) AND " +
            "(:brand IS NULL OR p.brand ILIKE %:brand%) AND " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:size IS NULL OR p.size = :size) AND " +
            "(:color IS NULL OR p.color = :color) AND " +
            "(:priceMin IS NULL OR p.price >= :priceMin) AND " +
            "(:priceMax IS NULL OR p.price <= :priceMax)")
    List<Product> findFiltered(
            @Param("name") String name,
            @Param("brand") String brand,
            @Param("categoryId") Long categoryId,
            @Param("size") String size,
            @Param("color") String color,
            @Param("priceMin") BigDecimal priceMin,
            @Param("priceMax") BigDecimal priceMax
    );
}