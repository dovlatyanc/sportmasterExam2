package com.shop.sportmaster.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

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
    private List<GuestOrderItem> cartItems;
}