
package com.shop.sportmaster.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GuestOrderItem {
    @NotNull(message = "ID товара обязателен")
    private Long productId;

    @Min(value = 1, message = "Количество должно быть >= 1")
    private int quantity;
}