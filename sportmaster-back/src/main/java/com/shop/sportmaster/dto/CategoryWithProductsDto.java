package com.shop.sportmaster.dto;

import com.shop.sportmaster.model.Product;

import java.util.List;

public class CategoryWithProductsDto {
    private Long id;
    private String name;
    private List<Product> products; // без связи обратно
}