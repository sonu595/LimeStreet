package com.Clothing.Startup.Controller;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.Clothing.Startup.Model.Cart;
import com.Clothing.Startup.Model.Product;
import com.Clothing.Startup.Repository.CartRepository;
import com.Clothing.Startup.Repository.ProductRepository;
import com.Clothing.Startup.Repository.UserRepository;
import com.Clothing.Startup.Util.JwtUtil;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepo;
    
    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;
    
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
        return userRepo.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Cart enrichCartItem(Cart item) {
        Product product = productRepo.findById(item.getProductId()).orElse(null);

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
            item.setProductSizes(product.getSizes());
            item.setProductColors(product.getColors());
        }

        return item;
    }

    private String normalizeVariant(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        return value.trim();
    }

    private String resolveSize(Product product, String requestedSize) {
        String normalized = normalizeVariant(requestedSize);

        if (product.getSizes() == null || product.getSizes().isEmpty()) {
            return normalized;
        }

        if (normalized.isBlank()) {
            return product.getSizes().get(0);
        }

        boolean valid = product.getSizes().stream().anyMatch(size -> size.equalsIgnoreCase(normalized));

        if (!valid) {
            throw new RuntimeException("Selected size is not available for this product.");
        }

        return product.getSizes().stream()
                .filter(size -> size.equalsIgnoreCase(normalized))
                .findFirst()
                .orElse(normalized);
    }

    private String resolveColor(Product product, String requestedColor) {
        String normalized = normalizeVariant(requestedColor);

        if (product.getColors() == null || product.getColors().isEmpty()) {
            return normalized;
        }

        if (normalized.isBlank()) {
            return product.getColors().get(0);
        }

        boolean valid = product.getColors().stream().anyMatch(color -> color.equalsIgnoreCase(normalized));

        if (!valid) {
            throw new RuntimeException("Selected color is not available for this product.");
        }

        return product.getColors().stream()
                .filter(color -> color.equalsIgnoreCase(normalized))
                .findFirst()
                .orElse(normalized);
    }

    @PostMapping
    public Cart addToCart(@RequestBody Cart cart, @RequestHeader("Authorization") String authorizationHeader) {
        Long userId = getUserIdFromToken(authorizationHeader);

        Product product = productRepo.findById(cart.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String selectedSize = resolveSize(product, cart.getSelectedSize());
        String selectedColor = resolveColor(product, cart.getSelectedColor());

        Cart savedCart = cartRepo.findByUserIdAndProductIdAndSelectedSizeAndSelectedColor(
                        userId,
                        cart.getProductId(),
                        selectedSize,
                        selectedColor)
                .map(existingItem -> {
                    int currentQuantity = existingItem.getQuantity() == null ? 0 : existingItem.getQuantity();
                    existingItem.setQuantity(currentQuantity + Math.max(cart.getQuantity() == null ? 1 : cart.getQuantity(), 1));
                    existingItem.setPrice(product.getPrice());
                    existingItem.setSelectedSize(selectedSize);
                    existingItem.setSelectedColor(selectedColor);
                    return existingItem;
                })
                .orElseGet(() -> {
                    cart.setUserId(userId);
                    cart.setQuantity(Math.max(cart.getQuantity() == null ? 1 : cart.getQuantity(), 1));
                    cart.setPrice(product.getPrice());
                    cart.setSelectedSize(selectedSize);
                    cart.setSelectedColor(selectedColor);
                    return cart;
                });

        return enrichCartItem(cartRepo.save(savedCart));
    }

    @GetMapping
    public List<Cart> getMyCart(@RequestHeader("Authorization") String authorizationHeader) {
        Long userId = getUserIdFromToken(authorizationHeader);
        return cartRepo.findByUserIdOrderByIdDesc(userId)
                .stream()
                .map(this::enrichCartItem)
                .toList();
    }

    @PutMapping("/{productId}")
    public Cart updateCartQuantity(
            @PathVariable Long productId,
            @RequestBody Map<String, Integer> request,
            @RequestHeader("Authorization") String authorizationHeader) {
        Long userId = getUserIdFromToken(authorizationHeader);
        Integer quantity = request.getOrDefault("quantity", 1);

        if (quantity <= 0) {
            cartRepo.deleteByIdAndUserId(productId, userId);
            throw new RuntimeException("Cart item removed");
        }

        Cart cartItem = cartRepo.findByIdAndUserId(productId, userId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItem.setQuantity(quantity);
        return enrichCartItem(cartRepo.save(cartItem));
    }

    @DeleteMapping("/{productId}")
    public Map<String, String> removeFromCart(@PathVariable Long productId, @RequestHeader("Authorization") String authorizationHeader) {
        Long userId = getUserIdFromToken(authorizationHeader);
        cartRepo.deleteByIdAndUserId(productId, userId);
        return Map.of("message", "Item removed from cart");
    }

    @DeleteMapping
    public Map<String, String> clearCart(@RequestHeader("Authorization") String authorizationHeader) {
        Long userId = getUserIdFromToken(authorizationHeader);
        cartRepo.deleteAllByUserId(userId);
        return Map.of("message", "Cart cleared");
    }

    @PostMapping("/add")
    public Cart addToCartLegacy(@RequestBody Cart cart, @RequestHeader("Authorization") String authorizationHeader) {
        return addToCart(cart, authorizationHeader);
    }

    @GetMapping("/mycart")
    public List<Cart> getMyCartLegacy(@RequestHeader("Authorization") String authorizationHeader) {
        return getMyCart(authorizationHeader);
    }

    @DeleteMapping("/remove/{productId}")
    public Map<String, String> removeFromCartLegacy(@PathVariable Long productId, @RequestHeader("Authorization") String authorizationHeader) {
        Long userId = getUserIdFromToken(authorizationHeader);
        cartRepo.deleteByUserIdAndProductId(userId, productId);
        return Map.of("message", "Item removed from cart");
    }

    @DeleteMapping("/clear")
    public Map<String, String> clearCartLegacy(@RequestHeader("Authorization") String authorizationHeader) {
        return clearCart(authorizationHeader);
    }
}
