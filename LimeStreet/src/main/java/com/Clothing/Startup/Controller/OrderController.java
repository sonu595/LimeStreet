package com.Clothing.Startup.Controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Clothing.Startup.Model.Cart;
import com.Clothing.Startup.Model.Order;
import com.Clothing.Startup.Model.OrderItem;
import com.Clothing.Startup.Model.Product;
import com.Clothing.Startup.Model.User;
import com.Clothing.Startup.Repository.CartRepository;
import com.Clothing.Startup.Repository.OrderRepository;
import com.Clothing.Startup.Repository.ProductRepository;
import com.Clothing.Startup.Repository.UserRepository;
import com.Clothing.Startup.Util.JwtUtil;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

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

    private User getCurrentUser(String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        Long userId = jwtUtil.extractUserId(token);

        if (userId != null) {
            return userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        return userRepository.findByEmail(jwtUtil.extractEmail(token))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void ensureAdmin(String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        String role = jwtUtil.extractRole(token);

        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new RuntimeException("Only admin users can manage orders.");
        }
    }

    private void ensureCompleteProfile(User user) {
        if (user.getName() == null || user.getName().isBlank()
                || user.getContactNumber() == null || user.getContactNumber().isBlank()
                || user.getAddressLine1() == null || user.getAddressLine1().isBlank()
                || user.getCity() == null || user.getCity().isBlank()
                || user.getState() == null || user.getState().isBlank()
                || user.getPostalCode() == null || user.getPostalCode().isBlank()) {
            throw new RuntimeException("Complete profile with phone number and address is required before placing an order.");
        }
    }

    private Order createBaseOrder(User user) {
        Order order = new Order();
        order.setUserId(user.getId());
        order.setCustomerName(user.getName());
        order.setCustomerEmail(user.getEmail());
        order.setContactNumber(user.getContactNumber());
        order.setAddressLine1(user.getAddressLine1());
        order.setAddressLine2(user.getAddressLine2());
        order.setCity(user.getCity());
        order.setState(user.getState());
        order.setPostalCode(user.getPostalCode());
        order.setCountry(user.getCountry());
        order.setItems(new ArrayList<>());
        return order;
    }

    private Order finalizeOrderPricing(Order order, double subtotal) {
        double deliveryCharge = subtotal > 999 ? 0 : 40;
        double platformFee = 10;

        order.setSubtotal(subtotal);
        order.setDeliveryCharge(deliveryCharge);
        order.setPlatformFee(platformFee);
        order.setTotalAmount(subtotal + deliveryCharge + platformFee);
        order.setStatus("PENDING");
        return order;
    }

    @PostMapping("/checkout")
    public Order checkout(@RequestHeader("Authorization") String authorizationHeader) {
        User user = getCurrentUser(authorizationHeader);
        ensureCompleteProfile(user);

        List<Cart> cartItems = cartRepository.findByUserIdOrderByIdDesc(user.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Your cart is empty.");
        }

        Order order = createBaseOrder(user);

        double subtotal = 0;

        for (Cart cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("One of the products in cart is no longer available."));

            int quantity = Math.max(cartItem.getQuantity() == null ? 1 : cartItem.getQuantity(), 1);
            double unitPrice = product.getPrice();
            double totalPrice = unitPrice * quantity;
            subtotal += totalPrice;

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setProductImage(product.getImageUrls() != null && !product.getImageUrls().isEmpty()
                    ? product.getImageUrls().get(0)
                    : product.getImageUrl());
            orderItem.setProductCategory(product.getCategory());
            orderItem.setSelectedSize(cartItem.getSelectedSize());
            orderItem.setSelectedColor(cartItem.getSelectedColor());
            orderItem.setQuantity(quantity);
            orderItem.setUnitPrice(unitPrice);
            orderItem.setTotalPrice(totalPrice);

            order.getItems().add(orderItem);
        }

        Order savedOrder = orderRepository.save(finalizeOrderPricing(order, subtotal));
        cartRepository.deleteAllByUserId(user.getId());
        return savedOrder;
    }

    @PostMapping("/buy-now")
    public Order buyNow(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, Object> request) {
        User user = getCurrentUser(authorizationHeader);
        ensureCompleteProfile(user);

        Long productId = Long.valueOf(String.valueOf(request.get("productId")));
        Integer quantity = request.get("quantity") == null ? 1 : Integer.valueOf(String.valueOf(request.get("quantity")));
        String selectedSize = request.get("selectedSize") == null ? "" : String.valueOf(request.get("selectedSize"));
        String selectedColor = request.get("selectedColor") == null ? "" : String.valueOf(request.get("selectedColor"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Order order = createBaseOrder(user);

        OrderItem orderItem = new OrderItem();
        orderItem.setProductId(product.getId());
        orderItem.setProductName(product.getName());
        orderItem.setProductImage(product.getImageUrls() != null && !product.getImageUrls().isEmpty()
                ? product.getImageUrls().get(0)
                : product.getImageUrl());
        orderItem.setProductCategory(product.getCategory());
        orderItem.setSelectedSize(selectedSize);
        orderItem.setSelectedColor(selectedColor);
        orderItem.setQuantity(Math.max(quantity, 1));
        orderItem.setUnitPrice(product.getPrice());
        orderItem.setTotalPrice(product.getPrice() * Math.max(quantity, 1));

        order.getItems().add(orderItem);

        return orderRepository.save(finalizeOrderPricing(order, orderItem.getTotalPrice()));
    }

    @GetMapping("/my")
    public List<Order> getMyOrders(@RequestHeader("Authorization") String authorizationHeader) {
        User user = getCurrentUser(authorizationHeader);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @GetMapping
    public List<Order> getAllOrders(@RequestHeader("Authorization") String authorizationHeader) {
        ensureAdmin(authorizationHeader);
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/{orderId}/review")
    public Order reviewOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authorizationHeader) {
        ensureAdmin(authorizationHeader);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String status = String.valueOf(request.getOrDefault("status", order.getStatus())).trim().toUpperCase();
        Integer deliveryDays = request.get("deliveryDays") == null
                ? order.getDeliveryDays()
                : Integer.valueOf(String.valueOf(request.get("deliveryDays")));
        String adminNote = request.get("adminNote") == null
                ? order.getAdminNote()
                : String.valueOf(request.get("adminNote")).trim();

        order.setStatus(status);
        order.setDeliveryDays(deliveryDays);
        order.setAdminNote(adminNote);

        if ("APPROVED".equals(status) || "PROCESSING".equals(status) || "DISPATCHED".equals(status)) {
            if (deliveryDays != null && deliveryDays >= 0) {
                order.setEstimatedDeliveryDate(LocalDate.now().plusDays(deliveryDays));
            }

            if (order.getApprovedAt() == null) {
                order.setApprovedAt(LocalDateTime.now());
            }
        }

        if ("REJECTED".equals(status) || "CANCELLED".equals(status)) {
            order.setEstimatedDeliveryDate(null);
        }

        return orderRepository.save(order);
    }
}
