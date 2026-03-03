package com.Startup.Ecommerce.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor 
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;

        public Product(String name, String description, Double price, Integer stock, 
                   String category, String brand, String imageUrl) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.brand = brand;
        this.imageUrl = imageUrl;
        this.rating = 0.0;
        this.reviewCount = 0;
    }
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}