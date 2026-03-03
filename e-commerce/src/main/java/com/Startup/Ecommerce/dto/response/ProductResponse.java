package com.Startup.Ecommerce.dto.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String category;
    private String brand;
    private String imageUrl;
    private Double rating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
}