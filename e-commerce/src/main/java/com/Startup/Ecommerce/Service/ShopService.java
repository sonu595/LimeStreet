package com.Startup.Ecommerce.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.Startup.Ecommerce.Models.User;
import com.Startup.Ecommerce.Repository.UserRepo;
import com.Startup.Ecommerce.dto.request.CartItemRequest;
import com.Startup.Ecommerce.dto.request.ShopItemRequest;
import com.Startup.Ecommerce.dto.request.ShopStateRequest;
import com.Startup.Ecommerce.dto.response.ShopStateResponse;
import com.Startup.Ecommerce.exception.NotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final UserRepo userRepo;
    private final ObjectMapper objectMapper;

    public ShopStateResponse getState(String email) {
        User user = findUser(email);
        return new ShopStateResponse(
            readWishlist(user.getWishlistData()),
            readCart(user.getCartData())
        );
    }

    public ShopStateResponse updateState(String email, ShopStateRequest request) {
        User user = findUser(email);

        List<ShopItemRequest> sanitizedWishlist = sanitizeWishlist(request.getWishlist());
        List<CartItemRequest> sanitizedCart = sanitizeCart(request.getCart());

        user.setWishlistData(writeValue(sanitizedWishlist));
        user.setCartData(writeValue(sanitizedCart));
        userRepo.save(user);

        return new ShopStateResponse(sanitizedWishlist, sanitizedCart);
    }

    private User findUser(String email) {
        return userRepo.findByEmail(email)
            .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private List<ShopItemRequest> sanitizeWishlist(List<ShopItemRequest> items) {
        if (items == null) {
            return new ArrayList<>();
        }

        return items.stream()
            .filter(item -> item.getId() != null)
            .toList();
    }

    private List<CartItemRequest> sanitizeCart(List<CartItemRequest> items) {
        if (items == null) {
            return new ArrayList<>();
        }

        return items.stream()
            .filter(item -> item.getId() != null)
            .map(item -> {
                if (item.getQuantity() == null || item.getQuantity() < 1) {
                    item.setQuantity(1);
                }
                return item;
            })
            .toList();
    }

    private List<ShopItemRequest> readWishlist(String rawJson) {
        if (rawJson == null || rawJson.isBlank()) {
            return new ArrayList<>();
        }

        try {
            return objectMapper.readValue(rawJson, new TypeReference<List<ShopItemRequest>>() {});
        } catch (JsonProcessingException exception) {
            return new ArrayList<>();
        }
    }

    private List<CartItemRequest> readCart(String rawJson) {
        if (rawJson == null || rawJson.isBlank()) {
            return new ArrayList<>();
        }

        try {
            return objectMapper.readValue(rawJson, new TypeReference<List<CartItemRequest>>() {});
        } catch (JsonProcessingException exception) {
            return new ArrayList<>();
        }
    }

    private String writeValue(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to persist shop state", exception);
        }
    }
}
