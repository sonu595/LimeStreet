package com.Clothing.Startup.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Clothing.Startup.Model.Cart;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);
    List<Cart> findByUserIdOrderByIdDesc(Long userId);
    Optional<Cart> findByUserIdAndProductIdAndSelectedSizeAndSelectedColor(
            Long userId,
            Long productId,
            String selectedSize,
            String selectedColor);
    Optional<Cart> findByIdAndUserId(Long id, Long userId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
    void deleteByIdAndUserId(Long id, Long userId);
    void deleteAllByUserId(Long userId);
    long countByUserId(Long userId);
}
