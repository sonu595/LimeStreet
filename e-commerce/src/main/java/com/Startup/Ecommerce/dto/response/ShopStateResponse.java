package com.Startup.Ecommerce.dto.response;

import java.util.ArrayList;
import java.util.List;

import com.Startup.Ecommerce.dto.request.CartItemRequest;
import com.Startup.Ecommerce.dto.request.ShopItemRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopStateResponse {
    private List<ShopItemRequest> wishlist = new ArrayList<>();
    private List<CartItemRequest> cart = new ArrayList<>();
}
