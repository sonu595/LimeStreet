package com.Startup.Ecommerce.dto.request;

import lombok.Data;

@Data
public class ShopItemRequest {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String color;
    private String brand;
    private String imageUrl;
    private Double rating;
    private Integer reviewCount;
    private Integer stock;
}
