package com.ecommerce.backend.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartSummaryResponse(
        List<CartItemResponse> items,
        BigDecimal total,
        Integer totalItems
) {
}
