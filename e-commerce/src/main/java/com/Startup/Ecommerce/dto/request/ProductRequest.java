package com.Startup.Ecommerce.dto.request;

import com.Startup.Ecommerce.Enum.Category;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;
    
    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;
    
    @NotNull(message = "Category is required")
    private Category category;
    
    private Category tshirtType;
    private Category designCategory;
    private String fabric;
    private String size;
    private String color;
    private String brand;
    private String imageUrl;
}