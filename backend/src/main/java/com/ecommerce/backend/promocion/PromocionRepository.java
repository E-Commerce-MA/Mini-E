package com.ecommerce.backend.promocion;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PromocionRepository extends JpaRepository<Promocion, Long> {
    Optional<Promocion> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
}