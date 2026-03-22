package com.Startup.Ecommerce.dto.request;

import lombok.Data;

@Data
public class CartItemRequest extends ShopItemRequest {
    private Integer quantity;
}
