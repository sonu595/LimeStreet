package com.Clothing.Startup.Model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class OrderItem {
    private Long productId;
    private String productName;
    private String productImage;
    private String productCategory;
    private String selectedSize;
    private String selectedColor;
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
}
