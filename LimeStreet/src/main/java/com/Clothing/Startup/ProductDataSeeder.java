package com.Clothing.Startup;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.Clothing.Startup.Model.Product;
import com.Clothing.Startup.Repository.ProductRepository;

@Configuration
public class ProductDataSeeder {

    @Bean
    CommandLineRunner seedProducts(ProductRepository productRepository) {
        return args -> {
            if (productRepository.existsByNewArrivalTrueOrSaleTrue()) {
                return;
            }

            productRepository.saveAll(List.of(
                createProduct(
                    "Midnight Daisy Tee",
                    1499,
                    1799.0,
                    17,
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=1200&fit=crop",
                    "Oversized black cotton tee with clean floral graphic for everyday wear.",
                    "S, M, L, XL",
                    "T-Shirts",
                    true,
                    false
                ),
                createProduct(
                    "Shadow Relaxed Hoodie",
                    2499,
                    2899.0,
                    14,
                    "https://images.unsplash.com/photo-1618354691551-44de113f0164?w=900&h=1200&fit=crop",
                    "Soft fleece hoodie designed for layering and calm monochrome styling.",
                    "M, L, XL",
                    "Hoodies",
                    true,
                    false
                ),
                createProduct(
                    "Streetline Cargo Pants",
                    2199,
                    2499.0,
                    12,
                    "https://images.unsplash.com/photo-1506629905607-d9c297d3dba2?w=900&h=1200&fit=crop",
                    "Relaxed fit cargo pants with utility pockets and daily comfort fit.",
                    "30, 32, 34, 36",
                    "Bottomwear",
                    true,
                    false
                ),
                createProduct(
                    "Monochrome Overshirt",
                    2699,
                    3099.0,
                    13,
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop",
                    "Lightweight overshirt with clean structure and easy street styling.",
                    "M, L, XL",
                    "Outerwear",
                    true,
                    false
                ),
                createProduct(
                    "Offbeat Graphic Tee",
                    999,
                    1599.0,
                    38,
                    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=1200&fit=crop",
                    "Discounted everyday tee with statement artwork and relaxed silhouette.",
                    "S, M, L",
                    "T-Shirts",
                    false,
                    true
                ),
                createProduct(
                    "Weekend Zip Jacket",
                    1899,
                    2799.0,
                    32,
                    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=1200&fit=crop",
                    "Structured zip jacket finished in dark tones for cooler evenings.",
                    "M, L, XL",
                    "Jackets",
                    false,
                    true
                ),
                createProduct(
                    "Slate Fit Denim",
                    1599,
                    2299.0,
                    30,
                    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&h=1200&fit=crop",
                    "Washed denim with a clean taper and subtle faded texture.",
                    "30, 32, 34, 36",
                    "Denim",
                    false,
                    true
                ),
                createProduct(
                    "Essential Layered Sweatshirt",
                    1399,
                    1999.0,
                    30,
                    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&h=1200&fit=crop",
                    "Heavyweight sweatshirt in dark palette with understated premium finish.",
                    "M, L, XL",
                    "Sweatshirts",
                    false,
                    true
                )
            ));
        };
    }

    private Product createProduct(
        String name,
        double price,
        Double originalPrice,
        Integer discountPercentage,
        String imageUrl,
        String description,
        String size,
        String category,
        boolean newArrival,
        boolean sale
    ) {
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setOriginalPrice(originalPrice);
        product.setDiscountPercentage(discountPercentage);
        product.setImageUrl(imageUrl);
        product.setImageUrls(new ArrayList<>(List.of(imageUrl)));
        product.setDescription(description);
        product.setSize(size);
        product.setSizes(new ArrayList<>(Arrays.stream(size.split(","))
                .map(String::trim)
                .toList()));
        product.setColors(new ArrayList<>(List.of("Black", "White")));
        product.setCategory(category);
        product.setNewArrival(newArrival);
        product.setSale(sale);
        return product;
    }
}
