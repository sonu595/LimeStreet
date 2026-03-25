package com.Clothing.Startup.Model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "products")
public class Product {
    private static final String DEFAULT_VARIANT = "default";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private Double originalPrice;
    private Integer discountPercentage;
    private String imageUrl;
    private String description;
    private String size;
    private String category;
    private Boolean newArrival;
    private Boolean sale;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size_value")
    private List<String> sizes = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color_value")
    private List<String> colors = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_variant_prices", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "variant_key")
    @Column(name = "variant_price")
    private Map<String, Double> variantPrices = new HashMap<>();

    @PrePersist
    @PreUpdate
    private void normalizeFlags() {
        if (newArrival == null) {
            newArrival = false;
        }

        if (sale == null) {
            sale = false;
        }
    }

    public String buildVariantKey(String sizeValue, String colorValue) {
        return normalizeVariantValue(sizeValue) + "||" + normalizeVariantValue(colorValue);
    }

    public double resolvePrice(String sizeValue, String colorValue) {
        if (variantPrices == null || variantPrices.isEmpty()) {
            return price;
        }

        String[] keys = new String[] {
                buildVariantKey(sizeValue, colorValue),
                buildVariantKey(sizeValue, ""),
                buildVariantKey("", colorValue),
                buildVariantKey("", "")
        };

        for (String key : keys) {
            Double resolvedPrice = variantPrices.get(key);

            if (resolvedPrice != null && resolvedPrice > 0) {
                return resolvedPrice;
            }
        }

        return price;
    }

    private String normalizeVariantValue(String value) {
        if (value == null || value.isBlank()) {
            return DEFAULT_VARIANT;
        }

        return value.trim().toLowerCase();
    }
}
