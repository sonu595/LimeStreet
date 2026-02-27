package com.Clothing.Startup.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Clothing.Startup.Model.Cart;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
}