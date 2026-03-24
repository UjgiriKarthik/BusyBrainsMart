package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Document(collection = "products")
public class Product {

    @Id
    private String id;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    private Double originalPrice;
    private String category;
    private String imageUrl;
    private Integer stock;
    private Double rating;
    private Integer reviewCount;
    private String brand;
    private boolean featured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;

    // No-arg constructor
    public Product() {}

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id, name, description, category, imageUrl, brand, createdBy;
        private Double price, originalPrice, rating;
        private Integer stock, reviewCount;
        private boolean featured;
        private LocalDateTime createdAt, updatedAt;

        public Builder id(String v) { this.id = v; return this; }
        public Builder name(String v) { this.name = v; return this; }
        public Builder description(String v) { this.description = v; return this; }
        public Builder price(Double v) { this.price = v; return this; }
        public Builder originalPrice(Double v) { this.originalPrice = v; return this; }
        public Builder category(String v) { this.category = v; return this; }
        public Builder imageUrl(String v) { this.imageUrl = v; return this; }
        public Builder stock(Integer v) { this.stock = v; return this; }
        public Builder rating(Double v) { this.rating = v; return this; }
        public Builder reviewCount(Integer v) { this.reviewCount = v; return this; }
        public Builder brand(String v) { this.brand = v; return this; }
        public Builder featured(boolean v) { this.featured = v; return this; }
        public Builder createdAt(LocalDateTime v) { this.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v) { this.updatedAt = v; return this; }
        public Builder createdBy(String v) { this.createdBy = v; return this; }
        public Product build() {
            Product p = new Product();
            p.id = id; p.name = name; p.description = description;
            p.price = price; p.originalPrice = originalPrice;
            p.category = category; p.imageUrl = imageUrl; p.stock = stock;
            p.rating = rating; p.reviewCount = reviewCount; p.brand = brand;
            p.featured = featured; p.createdAt = createdAt; p.updatedAt = updatedAt;
            p.createdBy = createdBy;
            return p;
        }
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Double getPrice() { return price; }
    public Double getOriginalPrice() { return originalPrice; }
    public String getCategory() { return category; }
    public String getImageUrl() { return imageUrl; }
    public Integer getStock() { return stock; }
    public Double getRating() { return rating; }
    public Integer getReviewCount() { return reviewCount; }
    public String getBrand() { return brand; }
    public boolean isFeatured() { return featured; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public String getCreatedBy() { return createdBy; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(Double price) { this.price = price; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }
    public void setCategory(String category) { this.category = category; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setRating(Double rating) { this.rating = rating; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}