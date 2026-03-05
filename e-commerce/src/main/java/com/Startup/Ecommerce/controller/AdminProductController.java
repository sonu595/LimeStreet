package com.Startup.Ecommerce.controller;

import com.Startup.Ecommerce.Models.Product;
import com.Startup.Ecommerce.Service.ProductService;
import com.Startup.Ecommerce.dto.request.ProductRequest;
import com.Startup.Ecommerce.dto.response.ApiResponse;
import com.Startup.Ecommerce.dto.response.ProductResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setTshirtType(request.getTshirtType());
        product.setDesignCategory(request.getDesignCategory());
        product.setFabric(request.getFabric());
        product.setSize(request.getSize());
        product.setColor(request.getColor());
        product.setBrand(request.getBrand());
        product.setImageUrl(request.getImageUrl());

        Product savedProduct = productService.createProduct(product);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product created", convertToResponse(savedProduct)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        Product existing = productService.getProductById(id);

        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrice(request.getPrice());
        existing.setStock(request.getStock());
        existing.setCategory(request.getCategory());
        existing.setTshirtType(request.getTshirtType());
        existing.setDesignCategory(request.getDesignCategory());
        existing.setFabric(request.getFabric());
        existing.setSize(request.getSize());
        existing.setColor(request.getColor());
        existing.setBrand(request.getBrand());
        existing.setImageUrl(request.getImageUrl());

        Product updated = productService.updateProduct(id, existing);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product updated", convertToResponse(updated)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product deleted", null));
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