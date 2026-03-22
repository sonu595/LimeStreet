package com.Startup.Ecommerce.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;
    
    private String description;  // ✅ ADD THIS
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;
    
    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;
    
    private String category;        // ✅ ALREADY HAVE
    private String tshirtType;      // ✅ ALREADY HAVE
    private String designCategory;  // ✅ ALREADY HAVE
    
    private String fabric;          // ✅ ADD THIS
    private String size;            // ✅ ADD THIS
    private String color;           // ✅ ADD THIS
    private String brand;           // ✅ ALREADY HAVE
    private String imageUrl;        // ✅ ALREADY HAVE
}