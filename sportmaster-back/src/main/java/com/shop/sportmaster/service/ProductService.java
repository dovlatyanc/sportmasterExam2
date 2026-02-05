package com.shop.sportmaster.service;

import com.shop.sportmaster.dto.ProductRequest;
import com.shop.sportmaster.model.Category;
import com.shop.sportmaster.model.Product;
import com.shop.sportmaster.repository.CartItemRepository;
import com.shop.sportmaster.repository.CategoryRepository;
import com.shop.sportmaster.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemRepository cartItemRepository;

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product create(ProductRequest request) {
        if (request.getCategoryId() == null) {
            throw new RuntimeException("Категория обязательна");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));

        Product product = new Product();
        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setSize(request.getSize());
        product.setColor(request.getColor());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setStock(request.getStock());

        return productRepository.save(product);
    }

    @Transactional
    public void delete(Long id) {
        cartItemRepository.deleteByProductId(id);
        productRepository.deleteById(id);
    }

    public Product update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));

        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setSize(request.getSize());
        product.setColor(request.getColor());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(category);

        return productRepository.save(product);
    }

    public List<Product> getFilteredProducts(
            String name,
            String brand,
            Long categoryId,
            String size,
            String color,
            Integer priceMin,
            Integer priceMax
    ) {
        BigDecimal min = (priceMin != null) ? BigDecimal.valueOf(priceMin) : null;
        BigDecimal max = (priceMax != null) ? BigDecimal.valueOf(priceMax) : null;

        return productRepository.findFiltered(
                name, brand, categoryId, size, color, min, max
        );
    }
}