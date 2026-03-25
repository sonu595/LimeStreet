package com.Clothing.Startup.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

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
    private String selectedSize;
    private String selectedColor;
    
    @Transient
    private String productName;
    
    @Transient
    private String productImage;

    @Transient
    private String productCategory;

    @Transient
    private Double originalPrice;

    @Transient
    private Integer discountPercentage;

    @Transient
    private List<String> productSizes;

    @Transient
    private List<String> productColors;
}
