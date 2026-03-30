package com.Clothing.Startup.Controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.Clothing.Startup.Model.Product;
import com.Clothing.Startup.Repository.ProductRepository;
import com.Clothing.Startup.Service.ProductImageStorageService;
import com.Clothing.Startup.Util.JwtUtil;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private static final String BEARER_PREFIX = "Bearer ";

    private final ProductRepository repo;
    private final JwtUtil jwtUtil;
    private final ProductImageStorageService productImageStorageService;

    public ProductController(
            ProductRepository repo,
            JwtUtil jwtUtil,
            ProductImageStorageService productImageStorageService) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
        this.productImageStorageService = productImageStorageService;
    }

    @GetMapping
    public List<Product> allProduct(){
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @GetMapping("/new-arrivals")
    public List<Product> newArrivals() {
        return repo.findByNewArrivalTrueOrderByIdDesc();
    }

    @GetMapping("/sale-items")
    public List<Product> saleItems() {
        return repo.findBySaleTrueOrderByDiscountPercentageDescIdDesc();
    }

    @PostMapping
    public Product addProduct(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @RequestBody Product p
    ){
        ensureAdmin(authorizationHeader);
        return repo.save(prepareProduct(p));
    }

    @PutMapping("/{id}")
    public Product update(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @PathVariable Long id,
        @RequestBody Product p
    ){
        ensureAdmin(authorizationHeader);
        p.setId(id);
        return repo.save(prepareProduct(p));
    }

    @DeleteMapping("/{id}")
    public void delete(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @PathVariable Long id
    ){
        ensureAdmin(authorizationHeader);
        repo.deleteById(id);
    }

    @PostMapping("/upload-images")
    public Map<String, List<String>> uploadImages(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @RequestParam("files") MultipartFile[] files
    ) {
        ensureAdmin(authorizationHeader);

        if (files == null || files.length == 0) {
            throw new RuntimeException("Please select at least one image.");
        }

        if (files.length > 4) {
            throw new RuntimeException("You can upload a maximum of 4 images.");
        }

        List<String> imageUrls = productImageStorageService.storeImages(files)
                .stream()
                .map(imageUrl -> ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path(imageUrl)
                        .toUriString())
                .toList();

        return Map.of("imageUrls", imageUrls);
    }

    private Product prepareProduct(Product product) {
        ensureCollectionsExist(product);
        fillSizesFromLegacyField(product);
        normalizeVariantPrices(product);
        applyDefaultFlags(product);
        setMainImage(product);
        syncLegacySizeField(product);
        updateBasePriceFromVariants(product);
        updateDiscountPercentage(product);
        return product;
    }

    private List<String> splitCsv(String input) {
        return Arrays.stream(input.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .collect(Collectors.toList());
    }

    private void ensureAdmin(String authorizationHeader) {
        String token = extractBearerToken(authorizationHeader);

        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid admin token.");
        }

        String role = jwtUtil.extractRole(token);

        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new RuntimeException("Only admin users can manage products.");
        }
    }

    private void ensureCollectionsExist(Product product) {
        if (product.getImageUrls() == null) {
            product.setImageUrls(new ArrayList<>());
        }

        if (product.getColors() == null) {
            product.setColors(new ArrayList<>());
        }

        if (product.getVariantPrices() == null) {
            product.setVariantPrices(new LinkedHashMap<>());
        }
    }

    private void fillSizesFromLegacyField(Product product) {
        if (product.getSizes() != null && !product.getSizes().isEmpty()) {
            return;
        }

        if (product.getSize() != null && !product.getSize().isBlank()) {
            product.setSizes(splitCsv(product.getSize()));
            return;
        }

        product.setSizes(new ArrayList<>());
    }

    private void normalizeVariantPrices(Product product) {
        product.setVariantPrices(product.getVariantPrices()
                .entrySet()
                .stream()
                .filter(entry -> entry.getKey() != null
                        && !entry.getKey().isBlank()
                        && entry.getValue() != null
                        && entry.getValue() > 0)
                .collect(Collectors.toMap(
                        entry -> entry.getKey().trim().toLowerCase(),
                        Map.Entry::getValue,
                        (first, second) -> second,
                        LinkedHashMap::new)));
    }

    private void applyDefaultFlags(Product product) {
        if (product.getNewArrival() == null) {
            product.setNewArrival(false);
        }

        if (product.getSale() == null) {
            product.setSale(false);
        }
    }

    private void setMainImage(Product product) {
        if (!product.getImageUrls().isEmpty()) {
            product.setImageUrl(product.getImageUrls().get(0));
        }
    }

    private void syncLegacySizeField(Product product) {
        if (!product.getSizes().isEmpty()) {
            product.setSize(String.join(", ", product.getSizes()));
        }
    }

    private void updateBasePriceFromVariants(Product product) {
        if (product.getVariantPrices().isEmpty()) {
            return;
        }

        double lowestVariantPrice = product.getVariantPrices().values()
                .stream()
                .filter(value -> value != null && value > 0)
                .mapToDouble(Double::doubleValue)
                .min()
                .orElse(product.getPrice());

        product.setPrice(lowestVariantPrice);
    }

    private void updateDiscountPercentage(Product product) {
        if (product.getOriginalPrice() == null || product.getOriginalPrice() <= product.getPrice()) {
            product.setDiscountPercentage(null);
            return;
        }

        int discount = (int) Math.round(
                ((product.getOriginalPrice() - product.getPrice()) / product.getOriginalPrice()) * 100);
        product.setDiscountPercentage(discount);
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            throw new RuntimeException("Admin authorization required.");
        }

        return authorizationHeader.substring(BEARER_PREFIX.length());
    }
}
