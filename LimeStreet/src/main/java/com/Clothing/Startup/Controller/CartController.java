package com.Clothing.Startup.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.Clothing.Startup.Model.Cart;
import com.Clothing.Startup.Model.Product;
import com.Clothing.Startup.Repository.CartRepository;
import com.Clothing.Startup.Repository.ProductRepository;
import com.Clothing.Startup.Util.JwtUtil;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepo;
    
    @Autowired
    private ProductRepository productRepo;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // Helper to get userId from token
    private Long getUserIdFromToken(String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        // You can fetch user from DB if needed
        return 1L; // Temporary - replace with actual user lookup
    }

    @PostMapping("/add")
    public String addToCart(@RequestBody Cart cart, @RequestHeader("Authorization") String token) {
        if (!jwtUtil.validateToken(token.substring(7))) {
            throw new RuntimeException("Invalid token");
        }
        
        Long userId = getUserIdFromToken(token);
        cart.setUserId(userId);
        
        Product product = productRepo.findById(cart.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        cart.setPrice(product.getPrice());
        cartRepo.save(cart);
        
        return "Item added to cart successfully";
    }

    @GetMapping("/mycart")
    public List<Cart> getMyCart(@RequestHeader("Authorization") String token) {
        if (!jwtUtil.validateToken(token.substring(7))) {
            throw new RuntimeException("Invalid token");
        }
        
        Long userId = getUserIdFromToken(token);
        List<Cart> cartItems = cartRepo.findByUserId(userId);
        
        // Add product details
        for (Cart item : cartItems) {
            Product product = productRepo.findById(item.getProductId()).orElse(null);
            if (product != null) {
                item.setProductName(product.getName());
                item.setProductImage(product.getImageUrl());
                item.setPrice(product.getPrice());
            }
        }
        
        return cartItems;
    }

    @DeleteMapping("/remove/{productId}")
    public String removeFromCart(@PathVariable Long productId, @RequestHeader("Authorization") String token) {
        if (!jwtUtil.validateToken(token.substring(7))) {
            throw new RuntimeException("Invalid token");
        }
        
        Long userId = getUserIdFromToken(token);
        cartRepo.deleteByUserIdAndProductId(userId, productId);
        
        return "Item removed from cart";
    }

    @DeleteMapping("/clear")
    public String clearCart(@RequestHeader("Authorization") String token) {
        if (!jwtUtil.validateToken(token.substring(7))) {
            throw new RuntimeException("Invalid token");
        }
        
        Long userId = getUserIdFromToken(token);
        List<Cart> cartItems = cartRepo.findByUserId(userId);
        cartRepo.deleteAll(cartItems);
        
        return "Cart cleared";
    }
}