package com.Startup.Ecommerce.dto.request;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String category;
    private String brand;
    private String imageUrl;
}