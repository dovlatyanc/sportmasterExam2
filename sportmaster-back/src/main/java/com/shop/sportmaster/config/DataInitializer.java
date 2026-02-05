// src/main/java/com/shop/sportmaster/config/DataInitializer.java
package com.shop.sportmaster.config;

import com.shop.sportmaster.model.Category;
import com.shop.sportmaster.model.Product;
import com.shop.sportmaster.model.Role;
import com.shop.sportmaster.repository.CategoryRepository;
import com.shop.sportmaster.repository.ProductRepository;
import com.shop.sportmaster.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @PostConstruct
    @Transactional
    public void init() {
        createRoles();
        createCategories();
        createProducts();
    }

    private void createRoles() {
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            roleRepository.save(new Role("ADMIN"));
        }
        if (roleRepository.findByName("USER").isEmpty()) {
            roleRepository.save(new Role("USER"));
        }
    }

    private void createCategories() {
        List<String> defaultCategories = Arrays.asList(
                "Обувь",
                "Одежда",
                "Аксессуары",
                "Инвентарь"
        );

        for (String categoryName : defaultCategories) {
            if (categoryRepository.findByName(categoryName).isEmpty()) {
                Category category = new Category();
                category.setName(categoryName);
                categoryRepository.save(category);
            }
        }
    }

    private void createProducts() {
        // Не создаём товары, если они уже есть
        if (productRepository.count() > 0) {
            return;
        }

        // Получаем категории
        Optional<Category> shoes = categoryRepository.findByName("Обувь");
        Optional<Category> clothes = categoryRepository.findByName("Одежда");
        Optional<Category> accessories = categoryRepository.findByName("Аксессуары");
        Optional<Category> inventory = categoryRepository.findByName("Инвентарь");

        // Товары по категориям
        Map<Optional<Category>, List<Product>> productsByCategory = Map.of(
                shoes, Arrays.asList(
                        newProduct("Кроссовки Nike Air Max", "Nike", "42", "Черный", new BigDecimal("9999"), 10),
                        newProduct("Беговые кроссовки Adidas", "Adidas", "43", "Белый", new BigDecimal("8499"), 15)
                ),
                clothes, Arrays.asList(
                        newProduct("Футболка хлопковая", "Puma", "M", "Синий", new BigDecimal("2499"), 25),
                        newProduct("Спортивные шорты", "Nike", "L", "Черный", new BigDecimal("3499"), 20)
                ),
                accessories, Arrays.asList(
                        newProduct("Спортивная бутылка", "CamelBak", "Универсальный", "Синий", new BigDecimal("1299"), 30),
                        newProduct("Фитнес-браслет", "Xiaomi", "Универсальный", "Черный", new BigDecimal("2999"), 12)
                ),
                inventory, Arrays.asList(
                        newProduct("Йога-коврик", "Decathlon", "183x61 см", "Фиолетовый", new BigDecimal("1599"), 8),
                        newProduct("Гантели 2 кг", "Torres", "2 кг", "Черный", new BigDecimal("1899"), 5)
                )
        );

        // Сохраняем товары
        productsByCategory.forEach((categoryOpt, products) -> {
            if (categoryOpt.isPresent()) {
                Category category = categoryOpt.get();
                for (Product product : products) {
                    product.setCategory(category);
                    productRepository.save(product);
                }
            }
        });
    }

    private Product newProduct(String name, String brand, String size, String color, BigDecimal price, int stock) {
        Product product = new Product();
        product.setName(name);
        product.setBrand(brand);
        product.setSize(size);
        product.setColor(color);
        product.setPrice(price);
        product.setStock(stock);
        return product;
    }
}