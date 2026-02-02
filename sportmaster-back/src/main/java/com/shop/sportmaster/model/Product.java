package com.shop.sportmaster.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;
    private String brand;
    private String size;
    private String color;
    private BigDecimal price;

    private int stock;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;


}

