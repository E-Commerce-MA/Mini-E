package com.ecommerce.backend.promocion;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promociones")
public class PromocionController {

    private final PromocionService promocionService;

    public PromocionController(PromocionService promocionService) {
        this.promocionService = promocionService;
    }

    @PostMapping
    public ResponseEntity<Promocion> crear(@RequestBody PromocionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(promocionService.crear(request));
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<Promocion> validar(@PathVariable String codigo) {
        return ResponseEntity.ok(promocionService.validar(codigo));
    }
}