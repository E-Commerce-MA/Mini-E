package com.ecommerce.backend.cart;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartSummaryResponse getCart() {
        return cartService.getCart();
    }

    @PostMapping("/{productId}")
    public ResponseEntity<CartSummaryResponse> addProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(cartService.addProduct(productId));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<CartSummaryResponse> updateQuantity(
            @PathVariable Long productId,
            @RequestBody CartUpdateRequest request) {
        return ResponseEntity.ok(cartService.updateQuantity(productId, request.getQuantity()));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<CartSummaryResponse> removeProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeProduct(productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}
