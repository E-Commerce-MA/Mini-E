package com.ecommerce.backend.order;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id")
    private PurchaseOrder order;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String tag;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    public OrderItem() {
    }

    public OrderItem(
            Long productId,
            String name,
            String category,
            String tag,
            String imageUrl,
            BigDecimal price,
            Integer quantity,
            BigDecimal subtotal) {
        this.productId = productId;
        this.name = name;
        this.category = category;
        this.tag = tag;
        this.imageUrl = imageUrl;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }

    public void setOrder(PurchaseOrder order) {
        this.order = order;
    }

    public Long getId() {
        return id;
    }

    public PurchaseOrder getOrder() {
        return order;
    }

    public Long getProductId() {
        return productId;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getTag() {
        return tag;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }
}
