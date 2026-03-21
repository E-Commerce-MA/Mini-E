package com.ecommerce.backend.order;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    @EntityGraph(attributePaths = "items")
    @Query("select o from PurchaseOrder o where o.id = :id")
    Optional<PurchaseOrder> findByIdWithItems(@Param("id") Long id);

    @EntityGraph(attributePaths = "items")
    @Query("select o from PurchaseOrder o order by o.createdAt desc, o.id desc")
    List<PurchaseOrder> findAllWithItemsOrderByCreatedAtDesc();
}
