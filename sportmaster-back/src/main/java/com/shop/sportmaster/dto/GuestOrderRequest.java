package com.shop.sportmaster.dto;

import com.shop.sportmaster.model.GuestOrderItem;
import lombok.Data;

import java.util.List;
import jakarta.validation.constraints.*;
@Data
public class GuestOrderRequest {

    @NotBlank(message = "ФИО обязательно")
    private String fullName;

    @Email(message = "Некорректный email")
    @NotBlank(message = "Email обязателен")
    private String email;

    @NotBlank(message = "Телефон обязателен")
    private String phone;

    @NotBlank(message = "Город обязателен")
    private String city;

    @NotBlank(message = "Страна обязательна")
    private String country;

    @NotEmpty(message = "Список товаров не может быть пустым")
    @NotNull(message = "Список товаров обязателен")
    private List<GuestOrderItem> cartItems; // лучше "cartItems", чем просто "items"
}