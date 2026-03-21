package com.ecommerce.backend.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String status,
        LocalDateTime createdAt,
        List<OrderItemResponse> items,
        BigDecimal total,
        Integer totalItems
) {
}
