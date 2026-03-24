package com.Clothing.Startup.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Clothing.Startup.Model.Cart;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);
    List<Cart> findByUserIdOrderByIdDesc(Long userId);
    Optional<Cart> findByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
    void deleteAllByUserId(Long userId);
    long countByUserId(Long userId);
}
