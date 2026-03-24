package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for product management.
 *
 * Access Control:
 * - GET endpoints: public / any authenticated user
 * - POST/PUT/DELETE: ADMIN only (@PreAuthorize)
 *
 * Endpoints:
 * GET    /api/products           - List all products
 * GET    /api/products/{id}      - Get product by ID
 * GET    /api/products/featured  - Get featured products
 * GET    /api/products/categories- Get all unique categories
 * POST   /api/products           - Create product (ADMIN)
 * PUT    /api/products/{id}      - Update product (ADMIN)
 * DELETE /api/products/{id}      - Delete product (ADMIN)
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // ─── Public / User READ endpoints ──────────────────────────────────────

    /** Get all products, optionally filtered by category or search term */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        List<Product> products;

        if (search != null && !search.isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCase(search);
        } else if (category != null && !category.isEmpty()) {
            products = productRepository.findByCategory(category);
        } else {
            products = productRepository.findAll();
        }

        return ResponseEntity.ok(products);
    }

    /** Get a single product by its MongoDB ID */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Get only featured products for homepage */
    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        return ResponseEntity.ok(productRepository.findByFeaturedTrue());
    }

    /** Get distinct categories for filter UI */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<Product> all = productRepository.findAll();
        List<String> categories = all.stream()
                .map(Product::getCategory)
                .filter(c -> c != null && !c.isEmpty())
                .distinct()
                .sorted()
                .toList();
        return ResponseEntity.ok(categories);
    }

    // ─── Admin-only WRITE endpoints ─────────────────────────────────────────

    /**
     * Create a new product. ADMIN role required.
     * Records the creating admin's username.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product,
                                                  Authentication authentication) {
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        product.setCreatedBy(authentication.getName());

        Product saved = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Update an existing product. ADMIN role required.
     * Preserves original createdAt and createdBy.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable String id,
                                                  @Valid @RequestBody Product productDetails) {
        Optional<Product> existing = productRepository.findById(id);

        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = existing.get();
        // Update all mutable fields
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setOriginalPrice(productDetails.getOriginalPrice());
        product.setCategory(productDetails.getCategory());
        product.setBrand(productDetails.getBrand());
        product.setImageUrl(productDetails.getImageUrl());
        product.setStock(productDetails.getStock());
        product.setRating(productDetails.getRating());
        product.setReviewCount(productDetails.getReviewCount());
        product.setFeatured(productDetails.isFeatured());
        product.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.ok(productRepository.save(product));
    }

    /**
     * Delete a product by ID. ADMIN role required.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable String id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        productRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product deleted successfully");
        return ResponseEntity.ok(response);
    }
}
