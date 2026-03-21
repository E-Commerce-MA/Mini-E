package com.ecommerce.backend.order;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long productId,
        String name,
        String category,
        String tag,
        String imageUrl,
        BigDecimal price,
        Integer quantity,
        BigDecimal subtotal
) {
}
