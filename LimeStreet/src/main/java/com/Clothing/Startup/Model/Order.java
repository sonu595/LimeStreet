package com.Clothing.Startup.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String customerName;
    private String customerEmail;
    private String contactNumber;
    private String status;
    private Double subtotal;
    private Double deliveryCharge;
    private Double platformFee;
    private Double totalAmount;
    private Integer deliveryDays;
    private LocalDate estimatedDeliveryDate;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;

    @Column(name = "address_line_1")
    private String addressLine1;

    @Column(name = "address_line_2")
    private String addressLine2;

    private String city;
    private String state;

    @Column(name = "postal_code")
    private String postalCode;

    private String country;

    @Column(length = 1000)
    private String adminNote;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "order_items", joinColumns = @JoinColumn(name = "order_id"))
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    private void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (status == null || status.isBlank()) {
            status = "PENDING";
        }

        if (country == null || country.isBlank()) {
            country = "India";
        }
    }
}
