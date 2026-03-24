package com.Clothing.Startup.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Clothing.Startup.Model.Product;
import com.Clothing.Startup.Model.WishlistItem;
import com.Clothing.Startup.Repository.ProductRepository;
import com.Clothing.Startup.Repository.UserRepository;
import com.Clothing.Startup.Repository.WishlistRepository;
import com.Clothing.Startup.Util.JwtUtil;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization token required");
        }

        String token = authorizationHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }

        return token;
    }

    private Long getUserIdFromToken(String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        Long userId = jwtUtil.extractUserId(token);

        if (userId != null) {
            return userId;
        }

        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private WishlistItem enrich(WishlistItem item) {
        Product product = productRepository.findById(item.getProductId()).orElse(null);

        if (product != null) {
            item.setProductName(product.getName());
            item.setProductImage(
                    product.getImageUrls() != null && !product.getImageUrls().isEmpty()
                            ? product.getImageUrls().get(0)
                            : product.getImageUrl());
            item.setProductCategory(product.getCategory());
            item.setPrice(product.getPrice());
            item.setOriginalPrice(product.getOriginalPrice());
            item.setDiscountPercentage(product.getDiscountPercentage());
        }

        return item;
    }

    @GetMapping
    public List<WishlistItem> getWishlist(@RequestHeader("Authorization") String authorizationHeader) {
        Long userId = getUserIdFromToken(authorizationHeader);
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::enrich)
                .toList();
    }

    @PostMapping
    public WishlistItem addToWishlist(
            @RequestBody Map<String, Long> request,
            @RequestHeader("Authorization") String authorizationHeader) {
        Long userId = getUserIdFromToken(authorizationHeader);
        Long productId = request.get("productId");

        if (productId == null) {
            throw new RuntimeException("Product id is required");
        }

        productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WishlistItem wishlistItem = wishlistRepository.findByUserIdAndProductId(userId, productId)
                .orElseGet(() -> {
                    WishlistItem item = new WishlistItem();
                    item.setUserId(userId);
                    item.setProductId(productId);
                    return item;
                });

        return enrich(wishlistRepository.save(wishlistItem));
    }

    @DeleteMapping("/{productId}")
    public Map<String, String> removeFromWishlist(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String authorizationHeader) {
        Long userId = getUserIdFromToken(authorizationHeader);
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
        return Map.of("message", "Item removed from wishlist");
    }
}
