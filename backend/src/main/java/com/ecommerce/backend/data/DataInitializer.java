package com.ecommerce.backend.data;

import com.ecommerce.backend.auth.AppUser;
import com.ecommerce.backend.auth.AppUserRepository;
import com.ecommerce.backend.auth.UserRole;
import com.ecommerce.backend.cart.CartItem;
import com.ecommerce.backend.cart.CartItemRepository;
import com.ecommerce.backend.product.Product;
import com.ecommerce.backend.product.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            ProductRepository productRepository,
            CartItemRepository cartItemRepository,
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();

        if (productRepository.count() == 0) {
            List<Product> products = List.of(
                    new Product("Mochila Ejecutiva Orion", "Accesorios", new BigDecimal("1299.00"), 12, "Nuevo",
                            "Mochila de uso diario con compartimento acolchado para laptop, cierres reforzados y acabado elegante para oficina o universidad.",
                            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80", true),
                    new Product("Camisa Oxford Premium", "Ropa", new BigDecimal("749.00"), 8, "Top venta",
                            "Camisa de corte clásico confeccionada en algodón de alta durabilidad. Ideal para un look formal y cómodo.",
                            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80", true),
                    new Product("Tenis Urban Classic", "Calzado", new BigDecimal("1899.00"), 5, "Edición limitada",
                            "Tenis urbanos con suela antiderrapante, materiales ligeros y diseño contemporáneo para uso diario.",
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", true),
                    new Product("Reloj Steel Chrono", "Accesorios", new BigDecimal("2450.00"), 15, "Recomendado",
                            "Reloj analógico con caja de acero inoxidable, resistencia al agua y estilo versátil para cualquier ocasión.",
                            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80", true),
                    new Product("Audífonos Nimbus Pro", "Tecnología", new BigDecimal("1150.00"), 3, "Oferta",
                            "Audífonos inalámbricos con cancelación de ruido, batería extendida y sonido envolvente para trabajo o entretenimiento.",
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", true),
                    new Product("Lámpara Minimal Arc", "Hogar", new BigDecimal("990.00"), 1, "Nuevo",
                            "Lámpara decorativa de diseño minimalista con luz cálida regulable para espacios modernos.",
                            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80", true)
            );
            productRepository.saveAll(products);
        }

        if (cartItemRepository.count() == 0 && productRepository.count() > 0) {
            Product mochila = productRepository.findById(1L).orElse(null);
            Product reloj = productRepository.findById(4L).orElse(null);
            if (mochila != null) {
                cartItemRepository.save(new CartItem(mochila, 1));
            }
            if (reloj != null) {
                cartItemRepository.save(new CartItem(reloj, 2));
            }
        }
    }

    private void seedUsers() {
        if (!appUserRepository.existsByUsername("admin")) {
            appUserRepository.save(new AppUser("admin", passwordEncoder.encode("admin123"), UserRole.ADMIN, true));
        }

        if (!appUserRepository.existsByUsername("usuario")) {
            appUserRepository.save(new AppUser("usuario", passwordEncoder.encode("user123"), UserRole.USER, true));
        }
    }
}
