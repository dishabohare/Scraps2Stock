package com.scraps2stock.backend.repository;

import com.scraps2stock.backend.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findBySupplierEmail(String supplierEmail);

    Optional<Inventory> findByProductNameAndSupplierEmail(String productName, String supplierEmail);
}