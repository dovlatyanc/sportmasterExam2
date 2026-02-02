package com.shop.sportmaster.controller;

import com.shop.sportmaster.dto.ProductRequest;
import com.shop.sportmaster.model.Product;
import com.shop.sportmaster.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public Product create(@RequestBody ProductRequest request) {
        return productService.create(request);
    }

    @GetMapping
    public List<Product> getProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) Integer priceMin,
            @RequestParam(required = false) Integer priceMax
    ) {
        return productService.getFilteredProducts(
                name,
                brand,
                categoryId,
                size,
                color,
                priceMin,
                priceMax
        );
    }
}


