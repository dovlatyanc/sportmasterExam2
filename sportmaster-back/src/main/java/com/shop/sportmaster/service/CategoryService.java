package com.shop.sportmaster.service;

import com.shop.sportmaster.model.Category;
import com.shop.sportmaster.model.Product;
import com.shop.sportmaster.repository.CartItemRepository;
import com.shop.sportmaster.repository.CategoryRepository;
import com.shop.sportmaster.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    public Category create(String name) {
        // Проверяем, существует ли категория с таким именем
        return categoryRepository.findByName(name)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(name);
                    return categoryRepository.save(c);
                });
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));
    }

    @Transactional
    public Category update(Long id, String newName) {
        // Проверяем, не занято ли имя другой категорией
        if (categoryRepository.existsByNameAndIdNot(newName, id)) {
            throw new RuntimeException("Категория с таким именем уже существует");
        }

        Category category = findById(id);
        category.setName(newName);
        return categoryRepository.save(category);
    }

   @Transactional
   public void delete(Long id) {
       // 1. Получаем все товары категории
       List<Product> products = productRepository.findByCategoryId(id);

       // 2. Собираем ID товаров
       List<Long> productIds = products.stream()
               .map(Product::getId)
               .collect(Collectors.toList());

       // 3. Удаляем все записи из корзин для этих товаров
       if (!productIds.isEmpty()) {
           cartItemRepository.deleteByProductIds(productIds);
       }

       // 4. Удаляем сами товары (каскад уже не нужен)
       productRepository.deleteByCategoryId(id);

       // 5. Удаляем категорию
       categoryRepository.deleteById(id);
   }


    public Category save(Category category) {
        return categoryRepository.save(category);
    }
}