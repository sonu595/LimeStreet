package com.Startup.Ecommerce.Service;

import com.Startup.Ecommerce.Models.Product;
import com.Startup.Ecommerce.Enum.Category;
import com.Startup.Ecommerce.Repository.ProductRepo;
import com.Startup.Ecommerce.exception.NotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    
    private final ProductRepo productRepo;
    
    public ProductService(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }
    
    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }
    
    public Product getProductById(Long id) {
        return productRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Product not found with id: " + id));
    }
    
    public List<Product> getProductsByCategory(String category) {
        try {
            Category cat = Category.valueOf(category.toUpperCase());
            return productRepo.findByCategory(cat);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }
    
    public List<Product> getProductsByBrand(String brand) {
        return productRepo.findByBrand(brand);
    }
    
    public List<Product> getProductsByPriceRange(Double min, Double max) {
        return productRepo.findByPriceRange(min, max);
    }
    
    public List<Product> searchProducts(String keyword) {
        return productRepo.searchProducts(keyword);
    }
    
    public List<Product> getNewArrivals() {
        return productRepo.findTop10ByOrderByCreatedAtDesc();
    }
    
    public List<Product> getBestSellers() {
        return productRepo.findTop10ByOrderByRatingDesc();
    }
    
    public Product createProduct(Product product) {
        return productRepo.save(product);
    }
    
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setCategory(productDetails.getCategory());
        product.setTshirtType(productDetails.getTshirtType());
        product.setDesignCategory(productDetails.getDesignCategory());
        product.setFabric(productDetails.getFabric());
        product.setSize(productDetails.getSize());
        product.setColor(productDetails.getColor());
        product.setBrand(productDetails.getBrand());
        product.setImageUrl(productDetails.getImageUrl());
        
        return productRepo.save(product);
    }
    
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepo.delete(product);
    }
    
    public boolean existsById(Long id) {
        return productRepo.existsById(id);
    }
}