package com.ecommerce.backend.cart;

import java.math.BigDecimal;

public record CartItemResponse(
        Long productId,
        String name,
        String category,
        String tag,
        String imageUrl,
        BigDecimal price,
        Integer stock,
        Integer quantity,
        BigDecimal subtotal
) {
}
