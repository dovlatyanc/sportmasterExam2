package com.shop.sportmaster.service;



import com.shop.sportmaster.model.Category;
import com.shop.sportmaster.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category create(String name) {
        return categoryRepository.save(
                categoryRepository.findByName(name)
                        .orElseGet(() -> {
                            Category c = new Category();
                            c.setName(name);
                            return c;
                        })
        );
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }
}
