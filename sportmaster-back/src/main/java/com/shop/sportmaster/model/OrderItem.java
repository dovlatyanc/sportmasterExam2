// src/main/java/com/shop/sportmaster/model/OrderItem.java
package com.shop.sportmaster.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "order_item") // или order_items — как в БД
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ← ЭТО ОБЯЗАТЕЛЬНО
    private Long id;

    @ManyToOne
    @JsonBackReference
    private Order order;

    @ManyToOne
    private Product product;

    private int quantity;
    private BigDecimal priceAtOrder;
}