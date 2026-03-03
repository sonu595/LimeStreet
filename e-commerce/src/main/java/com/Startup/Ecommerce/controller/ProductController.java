package com.Startup.Ecommerce.controller;

import com.Startup.Ecommerce.Models.Product;
import com.Startup.Ecommerce.Service.ProductService;
import com.Startup.Ecommerce.dto.request.ProductRequest;
import com.Startup.Ecommerce.dto.response.ApiResponse;
import com.Startup.Ecommerce.dto.response.ProductResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductResponse> response = products.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Products fetched successfully", response));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product fetched successfully", convertToResponse(product)));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        List<ProductResponse> response = products.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Products fetched successfully", response));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(@RequestParam String q) {
        List<Product> products = productService.searchProducts(q);
        List<ProductResponse> response = products.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Search results fetched successfully", response));
    }
    
    @GetMapping("/new-arrivals")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getNewArrivals() {
        List<Product> products = productService.getNewArrivals();
        List<ProductResponse> response = products.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "New arrivals fetched successfully", response));
    }
    
    @GetMapping("/best-sellers")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getBestSellers() {
        List<Product> products = productService.getBestSellers();
        List<ProductResponse> response = products.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Best sellers fetched successfully", response));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@RequestBody ProductRequest request) {
        Product product = new Product(
            request.getName(),
            request.getDescription(),
            request.getPrice(),
            request.getStock(),
            request.getCategory(),
            request.getBrand(),
            request.getImageUrl()
        );
        
        Product savedProduct = productService.createProduct(product);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product created successfully", convertToResponse(savedProduct)));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        Product productDetails = new Product(
            request.getName(),
            request.getDescription(),
            request.getPrice(),
            request.getStock(),
            request.getCategory(),
            request.getBrand(),
            request.getImageUrl()
        );
        
        Product updatedProduct = productService.updateProduct(id, productDetails);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product updated successfully", convertToResponse(updatedProduct)));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product deleted successfully", null));
    }
    
    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setCategory(product.getCategory());
        response.setBrand(product.getBrand());
        response.setImageUrl(product.getImageUrl());
        response.setRating(product.getRating());
        response.setReviewCount(product.getReviewCount());
        response.setCreatedAt(product.getCreatedAt());
        return response;
    }
}