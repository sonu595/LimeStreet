package com.Startup.Ecommerce.Service;

import com.Startup.Ecommerce.Models.Product;
import com.Startup.Ecommerce.Repository.ProductRepo;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final ProductRepo productRepo;

    public AdminService(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

    public Product saveProduct(Product product) {
        return productRepo.save(product);
    }

    public void deleteProduct(Long id) {
        productRepo.deleteById(id);
    }

    public boolean existsById(Long id) {
        return productRepo.existsById(id);
    }
}