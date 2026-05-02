package com.scraps2stock.backend.repository;

import com.scraps2stock.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByVendorEmail(String email);

    List<Order> findBySupplierEmail(String email);
}