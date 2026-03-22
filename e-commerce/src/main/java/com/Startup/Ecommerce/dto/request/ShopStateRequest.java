package com.Startup.Ecommerce.dto.request;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ShopStateRequest {
    private List<ShopItemRequest> wishlist = new ArrayList<>();
    private List<CartItemRequest> cart = new ArrayList<>();
}
