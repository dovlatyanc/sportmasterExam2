// src/main/java/com/shop/sportmaster/dto/ProductRequest.java
package com.shop.sportmaster.dto;

import java.math.BigDecimal;

public class ProductRequest {
        public String name;
        public String brand;
        public String size;
        public String color;
        public BigDecimal price;
        public int stock;
        public Long categoryId;


        public String getName() { return name; }
        public String getBrand() { return brand; }
        public String getSize() { return size; }
        public String getColor() { return color; }
        public BigDecimal getPrice() { return price; }
        public int getStock() { return stock; }
        public Long getCategoryId() { return categoryId; }
}