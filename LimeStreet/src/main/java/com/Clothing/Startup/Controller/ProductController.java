package com.Clothing.Startup.Controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProductController {
    @Autowired
    private ProductRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ProductImageStorageService productImageStorageService;

    @GetMapping
    public List<Product> allProduct(){
        return repo.findAll();
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
        if (product.getImageUrls() == null) {
            product.setImageUrls(new ArrayList<>());
        }

        if (product.getSizes() == null || product.getSizes().isEmpty()) {
            if (product.getSize() != null && !product.getSize().isBlank()) {
                product.setSizes(splitCsv(product.getSize()));
            } else {
                product.setSizes(new ArrayList<>());
            }
        }

        if (product.getColors() == null) {
            product.setColors(new ArrayList<>());
        }

        if (product.getNewArrival() == null) {
            product.setNewArrival(false);
        }

        if (product.getSale() == null) {
            product.setSale(false);
        }

        if (!product.getImageUrls().isEmpty()) {
            product.setImageUrl(product.getImageUrls().get(0));
        }

        if (!product.getSizes().isEmpty()) {
            product.setSize(String.join(", ", product.getSizes()));
        }

        if (product.getOriginalPrice() != null && product.getOriginalPrice() > product.getPrice()) {
            int discount = (int) Math.round(((product.getOriginalPrice() - product.getPrice()) / product.getOriginalPrice()) * 100);
            product.setDiscountPercentage(discount);
        } else {
            product.setDiscountPercentage(null);
        }

        return product;
    }

    private List<String> splitCsv(String input) {
        return Arrays.stream(input.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .collect(Collectors.toList());
    }

    private void ensureAdmin(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Admin authorization required.");
        }

        String token = authorizationHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid admin token.");
        }

        String role = jwtUtil.extractRole(token);

        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new RuntimeException("Only admin users can manage products.");
        }
    }
}
