package com.Clothing.Startup.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Clothing.Startup.Model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findAllByOrderByCreatedAtDesc();
}
