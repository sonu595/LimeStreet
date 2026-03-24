package com.Clothing.Startup.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Clothing.Startup.Model.Product;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNewArrivalTrueOrderByIdDesc();
    List<Product> findBySaleTrueOrderByDiscountPercentageDescIdDesc();
    boolean existsByNewArrivalTrueOrSaleTrue();
}
