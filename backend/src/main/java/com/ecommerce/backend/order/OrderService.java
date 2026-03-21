package com.ecommerce.backend.order;

import com.ecommerce.backend.cart.CartItem;
import com.ecommerce.backend.cart.CartItemRepository;
import com.ecommerce.backend.product.Product;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private static final String ORDER_CONFIRMED = "CONFIRMADA";

    private final CartItemRepository cartItemRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public OrderService(CartItemRepository cartItemRepository, PurchaseOrderRepository purchaseOrderRepository) {
        this.cartItemRepository = cartItemRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @Transactional
    public OrderResponse checkout() {
        List<CartItem> cartItems = cartItemRepository.findAll();
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("No hay productos en el carrito para confirmar la compra");
        }

        int totalItems = cartItems.stream()
                .map(CartItem::getQuantity)
                .reduce(0, Integer::sum);

        BigDecimal total = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        PurchaseOrder order = new PurchaseOrder(total, totalItems, ORDER_CONFIRMED, LocalDateTime.now());

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            order.addItem(new OrderItem(
                    product.getId(),
                    product.getName(),
                    product.getCategory(),
                    product.getTag(),
                    product.getImageUrl(),
                    product.getPrice(),
                    cartItem.getQuantity(),
                    subtotal));
        }

        PurchaseOrder savedOrder = purchaseOrderRepository.saveAndFlush(order);
        cartItemRepository.deleteAll();

        return toResponse(savedOrder);
    }

    public OrderResponse getOrderById(Long id) {
        PurchaseOrder order = purchaseOrderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada con id " + id));
        return toResponse(order);
    }

    public List<OrderResponse> getOrders() {
        return purchaseOrderRepository.findAllWithItemsOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private OrderResponse toResponse(PurchaseOrder order) {
        List<OrderItemResponse> items = order.getItems()
                .stream()
                .sorted(Comparator.comparing(OrderItem::getProductId))
                .map(item -> new OrderItemResponse(
                        item.getProductId(),
                        item.getName(),
                        item.getCategory(),
                        item.getTag(),
                        item.getImageUrl(),
                        item.getPrice(),
                        item.getQuantity(),
                        item.getSubtotal()))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getCreatedAt(),
                items,
                order.getTotal(),
                order.getTotalItems());
    }
}
