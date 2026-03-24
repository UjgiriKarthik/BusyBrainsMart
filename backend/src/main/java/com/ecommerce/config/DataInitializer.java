package com.ecommerce.config;

import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds the MongoDB database with default users and sample products
 * on application startup if they don't already exist.
 *
 * Predefined accounts:
 * - admin / admin123 / ROLE_ADMIN (can create, edit, delete products)
 * - user  / user123  / ROLE_USER  (can only view products)
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedProducts();
    }

    private void seedUsers() {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@BusyBrainsMart.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .fullName("Admin User")
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            logger.info("Created admin user: admin / admin123");
        }

        // Create regular user if not exists
        if (!userRepository.existsByUsername("user")) {
            User regularUser = User.builder()
                    .username("user")
                    .email("user@BusyBrainsMart.com")
                    .password(passwordEncoder.encode("user123"))
                    .role("ROLE_USER")
                    .fullName("Regular User")
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(regularUser);
            logger.info("Created regular user: user / user123");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            List<Product> products = List.of(
                Product.builder()
                    .name("Apple MacBook Pro 16\"")
                    .description("M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for professionals and creatives.")
                    .price(2499.00).originalPrice(2799.00)
                    .category("Electronics").brand("Apple")
                    .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400")
                    .stock(15).rating(4.8).reviewCount(342).featured(true)
                    .createdBy("admin").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                    .build(),
                Product.builder()
                    .name("Samsung Galaxy S24 Ultra")
                    .description("200MP camera, AI-powered features, 6.8\" Dynamic AMOLED display.")
                    .price(1299.00).originalPrice(1399.00)
                    .category("Electronics").brand("Samsung")
                    .imageUrl("https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400")
                    .stock(28).rating(4.7).reviewCount(521).featured(true)
                    .createdBy("admin").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                    .build(),
                Product.builder()
                    .name("Sony WH-1000XM5 Headphones")
                    .description("Industry-leading noise cancellation, 30hr battery, Hi-Res Audio.")
                    .price(349.00).originalPrice(399.00)
                    .category("Electronics").brand("Sony")
                    .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400")
                    .stock(45).rating(4.9).reviewCount(876).featured(true)
                    .createdBy("admin").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                    .build(),
                Product.builder()
                    .name("Nike Air Max 270")
                    .description("Max Air cushioning for all-day comfort. Breathable mesh upper.")
                    .price(129.00).originalPrice(150.00)
                    .category("Fashion").brand("Nike")
                    .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400")
                    .stock(60).rating(4.5).reviewCount(234).featured(false)
                    .createdBy("admin").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                    .build(),
                Product.builder()
                    .name("LEGO Technic Bugatti Chiron")
                    .description("3,599-piece set. Authentic Bugatti Chiron design with working W16 engine.")
                    .price(449.00).originalPrice(449.00)
                    .category("Toys").brand("LEGO")
                    .imageUrl("https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400")
                    .stock(12).rating(4.9).reviewCount(189).featured(true)
                    .createdBy("admin").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                    .build(),
                Product.builder()
                    .name("KitchenAid Stand Mixer")
                    .description("5-quart bowl, 10 speeds, 59 attachments available. Tilt-head design.")
                    .price(429.00).originalPrice(499.00)
                    .category("Home & Kitchen").brand("KitchenAid")
                    .imageUrl("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400")
                    .stock(20).rating(4.8).reviewCount(1204).featured(false)
                    .createdBy("admin").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                    .build(),
                Product.builder()
                    .name("iPad Air 5th Generation")
                    .description("M1 chip, 10.9\" Liquid Retina display, USB-C, 5G capable.")
                    .price(749.00).originalPrice(749.00)
                    .category("Electronics").brand("Apple")
                    .imageUrl("https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400")
                    .stock(33).rating(4.7).reviewCount(456).featured(false)
                    .createdBy("admin").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                    .build(),
                Product.builder()
                    .name("Dyson V15 Detect Vacuum")
                    .description("Laser dust detection, HEPA filtration, 60-min runtime. Auto power adjustment.")
                    .price(749.00).originalPrice(849.00)
                    .category("Home & Kitchen").brand("Dyson")
                    .imageUrl("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400")
                    .stock(18).rating(4.6).reviewCount(312).featured(false)
                    .createdBy("admin").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                    .build(),
                Product.builder()
                    .name("Adidas Ultraboost 23")
                    .description("Responsive BOOST midsole, Primeknit+ upper, Continental rubber outsole.")
                    .price(189.00).originalPrice(210.00)
                    .category("Fashion").brand("Adidas")
                    .imageUrl("https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400")
                    .stock(55).rating(4.6).reviewCount(678).featured(false)
                    .createdBy("admin").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                    .build(),
                Product.builder()
                    .name("Instant Pot Duo 7-in-1")
                    .description("Pressure cooker, slow cooker, rice cooker, steamer, sauté, warmer & more.")
                    .price(99.00).originalPrice(129.00)
                    .category("Home & Kitchen").brand("Instant Pot")
                    .imageUrl("https://images.unsplash.com/photo-1585515320310-259814833e62?w=400")
                    .stock(70).rating(4.7).reviewCount(2341).featured(false)
                    .createdBy("admin").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                    .build()
            );

            productRepository.saveAll(products);
            logger.info("Seeded {} sample products", products.size());
        }
    }
}
