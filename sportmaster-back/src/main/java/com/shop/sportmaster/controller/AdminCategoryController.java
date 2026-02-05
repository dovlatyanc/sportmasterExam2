
package com.shop.sportmaster.controller;

import com.shop.sportmaster.dto.CategoryUpdateRequest;
import com.shop.sportmaster.model.Category;
import com.shop.sportmaster.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAll();
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.save(category);
    }


    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody CategoryUpdateRequest request) {
        return categoryService.update(id, request.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
    }
}