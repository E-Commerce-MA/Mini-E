package com.ecommerce.backend.order;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Column(nullable = false)
    private Integer totalItems;

    @Column(nullable = false, length = 32)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public PurchaseOrder() {
    }

    public PurchaseOrder(BigDecimal total, Integer totalItems, String status, LocalDateTime createdAt) {
        this.total = total;
        this.totalItems = totalItems;
        this.status = status;
        this.createdAt = createdAt;
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }
}
