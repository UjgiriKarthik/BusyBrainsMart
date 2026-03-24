package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MongoDB repository for Product documents.
 */
@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    /** Get all products in a specific category */
    List<Product> findByCategory(String category);

    /** Get featured products for homepage banner */
    List<Product> findByFeaturedTrue();

    /** Search products by name (case-insensitive regex) */
    List<Product> findByNameContainingIgnoreCase(String name);

    /** Get products by brand */
    List<Product> findByBrand(String brand);

    /** Get products within price range */
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
}
