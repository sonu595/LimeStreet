package com.Clothing.Startup.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private Long productId;
    private Integer quantity;
    private Double price;
    
    @Transient
    private String productName;
    
    @Transient
    private String productImage;
}