package com.Clothing.Startup.Controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
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

    private static final Set<String> CUSTOMER_CANCELLABLE_STATUSES = Set.of("PROCESSING", "PACKED", "IN_TRANSIT");

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

    private boolean canCustomerCancelOrder(Order order) {
        if ("CANCELLED".equalsIgnoreCase(order.getStatus()) || "DELIVERED".equalsIgnoreCase(order.getStatus())) {
            return false;
        }

        if (order.getEstimatedDeliveryAt() != null && !order.getEstimatedDeliveryAt().isAfter(LocalDateTime.now())) {
            return false;
        }

        return CUSTOMER_CANCELLABLE_STATUSES.contains(order.getStatus());
    }

    private Order applyAutomaticTrackingState(Order order) {
        if (order == null) {
            return null;
        }

        if ("CANCELLED".equalsIgnoreCase(order.getStatus())) {
            return order;
        }

        if (order.getApprovedAt() == null) {
            order.setApprovedAt(order.getCreatedAt() == null ? LocalDateTime.now() : order.getCreatedAt());
        }

        if (order.getDeliveryDays() == null || order.getDeliveryDays() <= 0) {
            order.setDeliveryDays(3);
        }

        if (order.getEstimatedDeliveryAt() == null) {
            LocalDateTime estimatedDeliveryAt = order.getApprovedAt().plusDays(order.getDeliveryDays());
            order.setEstimatedDeliveryAt(estimatedDeliveryAt);
            order.setEstimatedDeliveryDate(estimatedDeliveryAt.toLocalDate());
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime packedAt = order.getApprovedAt().plusDays(1);
        LocalDateTime inTransitAt = order.getApprovedAt().plusDays(2);

        if (!order.getEstimatedDeliveryAt().isAfter(now)) {
            order.setStatus("DELIVERED");
        } else if (!inTransitAt.isAfter(now)) {
            order.setStatus("IN_TRANSIT");
        } else if (!packedAt.isAfter(now)) {
            order.setStatus("PACKED");
        } else {
            order.setStatus("PROCESSING");
        }

        return order;
    }

    private String readOptionalValue(Map<String, Object> request, String key, String fallback) {
        if (request == null || !request.containsKey(key)) {
            return fallback;
        }

        Object value = request.get(key);
        return value == null ? "" : String.valueOf(value).trim();
    }

    private void applyOrderDeliveryDetails(Order order, User user, Map<String, Object> request) {
        order.setCustomerName(readOptionalValue(request, "customerName", user.getName()));
        order.setContactNumber(readOptionalValue(request, "contactNumber", user.getContactNumber()));
        order.setAddressLine1(readOptionalValue(request, "addressLine1", user.getAddressLine1()));
        order.setAddressLine2(readOptionalValue(request, "addressLine2", user.getAddressLine2()));
        order.setCity(readOptionalValue(request, "city", user.getCity()));
        order.setState(readOptionalValue(request, "state", user.getState()));
        order.setPostalCode(readOptionalValue(request, "postalCode", user.getPostalCode()));
        order.setCountry(readOptionalValue(request, "country", user.getCountry() == null ? "India" : user.getCountry()));
    }

    private void ensureCompleteProfile(Order order) {
        if (order.getCustomerName() == null || order.getCustomerName().isBlank()
                || order.getContactNumber() == null || order.getContactNumber().isBlank()
                || order.getAddressLine1() == null || order.getAddressLine1().isBlank()
                || order.getCity() == null || order.getCity().isBlank()
                || order.getState() == null || order.getState().isBlank()
                || order.getPostalCode() == null || order.getPostalCode().isBlank()) {
            throw new RuntimeException("Name, phone number, and complete delivery address are required before placing an order.");
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
        LocalDateTime processingStartedAt = LocalDateTime.now();
        LocalDateTime estimatedDeliveryAt = processingStartedAt.plusDays(3);

        order.setSubtotal(subtotal);
        order.setDeliveryCharge(deliveryCharge);
        order.setPlatformFee(platformFee);
        order.setTotalAmount(subtotal + deliveryCharge + platformFee);
        order.setStatus("PROCESSING");
        order.setDeliveryDays(3);
        order.setApprovedAt(processingStartedAt);
        order.setEstimatedDeliveryAt(estimatedDeliveryAt);
        order.setEstimatedDeliveryDate(estimatedDeliveryAt.toLocalDate());
        return order;
    }

    @Transactional
    @PostMapping("/checkout")
    public Order checkout(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody(required = false) Map<String, Object> request) {
        User user = getCurrentUser(authorizationHeader);

        List<Cart> cartItems = cartRepository.findByUserIdOrderByIdDesc(user.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Your cart is empty.");
        }

        Order order = createBaseOrder(user);
        applyOrderDeliveryDetails(order, user, request);
        ensureCompleteProfile(order);

        double subtotal = 0;

        for (Cart cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("One of the products in cart is no longer available."));

            int quantity = Math.max(cartItem.getQuantity() == null ? 1 : cartItem.getQuantity(), 1);
            double unitPrice = product.resolvePrice(cartItem.getSelectedSize(), cartItem.getSelectedColor());
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

        Long productId = Long.valueOf(String.valueOf(request.get("productId")));
        Integer quantity = request.get("quantity") == null ? 1 : Integer.valueOf(String.valueOf(request.get("quantity")));
        String selectedSize = request.get("selectedSize") == null ? "" : String.valueOf(request.get("selectedSize"));
        String selectedColor = request.get("selectedColor") == null ? "" : String.valueOf(request.get("selectedColor"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Order order = createBaseOrder(user);
        applyOrderDeliveryDetails(order, user, request);
        ensureCompleteProfile(order);

        OrderItem orderItem = new OrderItem();
        double unitPrice = product.resolvePrice(selectedSize, selectedColor);
        orderItem.setProductId(product.getId());
        orderItem.setProductName(product.getName());
        orderItem.setProductImage(product.getImageUrls() != null && !product.getImageUrls().isEmpty()
                ? product.getImageUrls().get(0)
                : product.getImageUrl());
        orderItem.setProductCategory(product.getCategory());
        orderItem.setSelectedSize(selectedSize);
        orderItem.setSelectedColor(selectedColor);
        orderItem.setQuantity(Math.max(quantity, 1));
        orderItem.setUnitPrice(unitPrice);
        orderItem.setTotalPrice(unitPrice * Math.max(quantity, 1));

        order.getItems().add(orderItem);

        return orderRepository.save(finalizeOrderPricing(order, orderItem.getTotalPrice()));
    }

    @GetMapping("/my")
    public List<Order> getMyOrders(@RequestHeader("Authorization") String authorizationHeader) {
        User user = getCurrentUser(authorizationHeader);
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        orders.forEach(this::applyAutomaticTrackingState);
        return orders;
    }

    @GetMapping("/my/{orderId}")
    public Order getMyOrderById(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String authorizationHeader) {
        User user = getCurrentUser(authorizationHeader);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!user.getId().equals(order.getUserId())) {
            throw new RuntimeException("You can only view your own orders.");
        }

        applyAutomaticTrackingState(order);
        return order;
    }

    @GetMapping
    public List<Order> getAllOrders(@RequestHeader("Authorization") String authorizationHeader) {
        ensureAdmin(authorizationHeader);
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        orders.forEach(this::applyAutomaticTrackingState);
        return orders;
    }

    @PutMapping("/{orderId}/cancel")
    public Order cancelOrder(
            @PathVariable Long orderId,
            @RequestBody(required = false) Map<String, Object> request,
            @RequestHeader("Authorization") String authorizationHeader) {
        User user = getCurrentUser(authorizationHeader);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!user.getId().equals(order.getUserId())) {
            throw new RuntimeException("You can only cancel your own orders.");
        }

        applyAutomaticTrackingState(order);

        if (!canCustomerCancelOrder(order)) {
            throw new RuntimeException("This order can no longer be cancelled.");
        }

        String cancellationReason = readOptionalValue(request, "reason", "");

        order.setStatus("CANCELLED");
        order.setCancellationReason(cancellationReason);
        order.setCancelledAt(LocalDateTime.now());
        order.setEstimatedDeliveryDate(null);
        order.setEstimatedDeliveryAt(null);
        order.setDeliveryDays(null);

        return orderRepository.save(order);
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

        if ("APPROVED".equals(status) || "PROCESSING".equals(status) || "DISPATCHED".equals(status) || "PACKED".equals(status) || "IN_TRANSIT".equals(status)) {
            LocalDateTime approvalTimestamp = order.getApprovedAt() == null ? LocalDateTime.now() : order.getApprovedAt();

            if (order.getApprovedAt() == null) {
                order.setApprovedAt(approvalTimestamp);
            }

            if (deliveryDays != null && deliveryDays >= 0) {
                LocalDateTime estimatedDeliveryAt = approvalTimestamp.plusDays(deliveryDays);
                order.setEstimatedDeliveryAt(estimatedDeliveryAt);
                order.setEstimatedDeliveryDate(estimatedDeliveryAt.toLocalDate());
            }
        }

        if ("REJECTED".equals(status) || "CANCELLED".equals(status)) {
            order.setEstimatedDeliveryDate(null);
            order.setEstimatedDeliveryAt(null);
            order.setDeliveryDays(null);
        }

        if ("CANCELLED".equals(status)) {
            if (order.getCancelledAt() == null) {
                order.setCancelledAt(LocalDateTime.now());
            }

            if (request.get("cancellationReason") != null) {
                order.setCancellationReason(String.valueOf(request.get("cancellationReason")).trim());
            }
        }

        return orderRepository.save(order);
    }
}
