package com.shop.sportmaster.service;

import com.shop.sportmaster.dto.ProductRequest;
import com.shop.sportmaster.model.Category;
import com.shop.sportmaster.model.Product;
import com.shop.sportmaster.repository.CategoryRepository;
import com.shop.sportmaster.repository.ProductRepository;
import com.shop.sportmaster.spec.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Product save(Product product) {
        return productRepository.save(product);
    }
    public List<Product> getAll() {
        return productRepository.findAll();
    }
    public Product create(ProductRequest request) {

        Category category = categoryRepository.findByName(request.category)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(request.name);
        product.setBrand(request.brand);
        product.setSize(request.size);
        product.setColor(request.color);
        product.setPrice(request.price);
        product.setCategory(category);
        product.setStock(request.stock);

        return productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
    public Product updateProduct(Long id, Product updated, Long categoryId) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));

        product.setName(updated.getName());
        product.setBrand(updated.getBrand());
        product.setSize(updated.getSize());
        product.setColor(updated.getColor());
        product.setPrice(updated.getPrice());
        product.setStock(updated.getStock());
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
        return productRepository.findAll(
                ProductSpecification.filter(
                        name, brand, categoryId, size, color, priceMin, priceMax
                )
        );
    }
}

