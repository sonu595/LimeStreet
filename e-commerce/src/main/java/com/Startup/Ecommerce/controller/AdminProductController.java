package com.Startup.Ecommerce.controller;

import com.Startup.Ecommerce.Models.Product;
import com.Startup.Ecommerce.Service.ProductService;
import com.Startup.Ecommerce.Service.FileUploadService;
import com.Startup.Ecommerce.dto.request.ProductRequest;
import com.Startup.Ecommerce.dto.response.ApiResponse;
import com.Startup.Ecommerce.dto.response.ProductResponse;
import com.Startup.Ecommerce.Enum.Category;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;
    private final FileUploadService fileUploadService;

    public AdminProductController(ProductService productService, FileUploadService fileUploadService) {
        this.productService = productService;
        this.fileUploadService = fileUploadService;
    }

    // ========== CREATE - JSON ENDPOINT ==========
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProductJson(
            @Valid @RequestBody ProductRequest request) {
        try {
            System.out.println("=== CREATE PRODUCT ===");
            System.out.println("Name: " + request.getName());
            
            Product product = convertToEntity(request);
            
            if (request.getImageBase64() != null && !request.getImageBase64().isEmpty()) {
                String imageUrl = fileUploadService.saveBase64Image(request.getImageBase64());
                product.setImageUrl(imageUrl);
            }
            
            Product savedProduct = productService.createProduct(product);
            return ResponseEntity.ok(new ApiResponse<>(true, "Product created", convertToResponse(savedProduct)));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ========== UPDATE - JSON ENDPOINT (ADD THIS) ==========
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductJson(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        try {
            System.out.println("=== UPDATE PRODUCT ===");
            System.out.println("ID: " + id);
            System.out.println("Name: " + request.getName());
            System.out.println("Price: " + request.getPrice());
            System.out.println("Stock: " + request.getStock());
            
            // Get existing product
            Product existing = productService.getProductById(id);
            
            // Update basic fields
            existing.setName(request.getName());
            existing.setDescription(request.getDescription() != null ? request.getDescription() : "");
            existing.setPrice(request.getPrice());
            existing.setStock(request.getStock());
            existing.setBrand(request.getBrand());
            
            // Update category fields
            existing.setCategory(convertToCategory(request.getCategory()));
            existing.setTshirtType(convertToCategory(request.getTshirtType()));
            existing.setDesignCategory(convertToCategory(request.getDesignCategory()));
            
            // Update additional fields
            existing.setFabric(request.getFabric() != null ? request.getFabric() : existing.getFabric());
            existing.setSize(request.getSize() != null ? request.getSize() : existing.getSize());
            existing.setColor(request.getColor() != null ? request.getColor() : existing.getColor());
            
            // Handle new image if provided
            if (request.getImageBase64() != null && !request.getImageBase64().isEmpty()) {
                // Delete old image if exists
                if (existing.getImageUrl() != null && existing.getImageUrl().startsWith("/uploads/")) {
                    try {
                        fileUploadService.deleteImage(existing.getImageUrl());
                        System.out.println("Deleted old image: " + existing.getImageUrl());
                    } catch (Exception e) {
                        System.err.println("Failed to delete old image: " + e.getMessage());
                    }
                }
                // Save new image
                String imageUrl = fileUploadService.saveBase64Image(request.getImageBase64());
                existing.setImageUrl(imageUrl);
                System.out.println("New image saved: " + imageUrl);
            } else if (request.getImageUrl() != null) {
                existing.setImageUrl(request.getImageUrl());
            }
            
            // Save updated product
            Product updatedProduct = productService.updateProduct(id, existing);
            System.out.println("Product updated successfully with ID: " + updatedProduct.getId());
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Product updated", convertToResponse(updatedProduct)));
            
        } catch (Exception e) {
            System.err.println("Error updating product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }

    // ========== FILE UPLOAD ENDPOINT ==========
    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<ProductResponse>> createProductWithFile(
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        
        try {
            if (image != null && !image.isEmpty()) {
                String imageUrl = fileUploadService.uploadImage(image);
                request.setImageUrl(imageUrl);
            }
            
            Product product = convertToEntity(request);
            Product savedProduct = productService.createProduct(product);
            return ResponseEntity.ok(new ApiResponse<>(true, "Product created", convertToResponse(savedProduct)));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ========== DELETE ENDPOINT ==========
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            if (product.getImageUrl() != null && product.getImageUrl().startsWith("/uploads/")) {
                try {
                    fileUploadService.deleteImage(product.getImageUrl());
                } catch (Exception e) {
                    System.err.println("Failed to delete image: " + e.getMessage());
                }
            }
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Product deleted", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ========== Helper Methods ==========
    
    private Product convertToEntity(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription() != null ? request.getDescription() : "");
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setBrand(request.getBrand());
        product.setImageUrl(request.getImageUrl());
        
        product.setCategory(convertToCategory(request.getCategory()));
        product.setTshirtType(convertToCategory(request.getTshirtType()));
        product.setDesignCategory(convertToCategory(request.getDesignCategory()));
        
        product.setFabric(request.getFabric() != null ? request.getFabric() : "Cotton");
        product.setSize(request.getSize() != null ? request.getSize() : "M");
        product.setColor(request.getColor() != null ? request.getColor() : "Black");
        
        return product;
    }

    private Category convertToCategory(String categoryStr) {
        if (categoryStr == null || categoryStr.trim().isEmpty()) return null;
        try {
            return Category.valueOf(categoryStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid category: " + categoryStr);
            return null;
        }
    }

    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setCategory(product.getCategory());
        response.setTshirtType(product.getTshirtType());
        response.setDesignCategory(product.getDesignCategory());
        response.setFabric(product.getFabric());
        response.setSize(product.getSize());
        response.setColor(product.getColor());
        response.setBrand(product.getBrand());
        response.setImageUrl(product.getImageUrl());
        response.setRating(product.getRating());
        response.setReviewCount(product.getReviewCount());
        response.setCreatedAt(product.getCreatedAt());
        return response;
    }
}