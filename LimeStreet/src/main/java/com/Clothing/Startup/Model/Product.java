package com.Clothing.Startup.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private Double originalPrice;
    private Integer discountPercentage;
    private String imageUrl;
    private String description;
    private String size;
    private String category;
    private boolean newArrival;
    private boolean sale;
}
