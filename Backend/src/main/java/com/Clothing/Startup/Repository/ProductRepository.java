package com.Clothing.Startup.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Clothing.Startup.Model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
}
