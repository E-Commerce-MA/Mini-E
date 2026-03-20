package com.ecommerce.backend.cart;

import com.ecommerce.backend.product.Product;
import com.ecommerce.backend.product.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public CartSummaryResponse getCart() {
        List<CartItemResponse> items = cartItemRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

        BigDecimal total = items.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer totalItems = items.stream()
                .map(CartItemResponse::quantity)
                .reduce(0, Integer::sum);

        return new CartSummaryResponse(items, total, totalItems);
    }

    @Transactional
    public CartSummaryResponse addProduct(Long productId) {
        Product product = getProduct(productId);
        CartItem item = cartItemRepository.findByProductId(productId)
                .orElse(new CartItem(product, 0));

        int newQuantity = item.getQuantity() + 1;
        validateStock(product, newQuantity);
        item.setProduct(product);
        item.setQuantity(newQuantity);
        cartItemRepository.save(item);

        return getCart();
    }

    @Transactional
    public CartSummaryResponse updateQuantity(Long productId, Integer quantity) {
        if (quantity == null) {
            throw new IllegalArgumentException("La cantidad es obligatoria");
        }
        if (quantity <= 0) {
            cartItemRepository.deleteByProductId(productId);
            return getCart();
        }

        Product product = getProduct(productId);
        validateStock(product, quantity);

        CartItem item = cartItemRepository.findByProductId(productId)
                .orElse(new CartItem(product, quantity));

        item.setProduct(product);
        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return getCart();
    }

    @Transactional
    public CartSummaryResponse removeProduct(Long productId) {
        cartItemRepository.deleteByProductId(productId);
        return getCart();
    }

    private Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id " + productId));
    }

    private void validateStock(Product product, Integer quantity) {
        if (quantity > product.getStock()) {
            throw new IllegalArgumentException("La cantidad solicitada excede el stock disponible");
        }
    }

    private CartItemResponse toResponse(CartItem item) {
        Product product = item.getProduct();
        BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemResponse(
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getTag(),
                product.getImageUrl(),
                product.getPrice(),
                product.getStock(),
                item.getQuantity(),
                subtotal
        );
    }
}
