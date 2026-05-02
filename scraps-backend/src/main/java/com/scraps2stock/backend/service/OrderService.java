package com.scraps2stock.backend.service;

import com.scraps2stock.backend.model.Inventory;
import com.scraps2stock.backend.model.Order;
import com.scraps2stock.backend.repository.InventoryRepository;
import com.scraps2stock.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public Order placeOrder(Order order) {
        Inventory inventory = inventoryRepository
                .findByProductNameAndSupplierEmail(order.getProductName(), order.getSupplierEmail())
                .orElseThrow(() -> new RuntimeException("Product not found in inventory"));

        if (inventory.getQuantity() < order.getQuantity()) {
            throw new RuntimeException("Not enough stock available");
        }

        inventory.setQuantity(inventory.getQuantity() - order.getQuantity());
        inventoryRepository.save(inventory);

        order.setCreatedAt(LocalDateTime.now());
        order.setOrderDate(LocalDateTime.now());
        order.setStatusUpdatedAt(LocalDateTime.now());

        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("PLACED");
        }

        return orderRepository.save(order);
    }

    public List<Order> getVendorOrders(String email) {
        return orderRepository.findByVendorEmail(email);
    }

    public List<Order> getSupplierOrders(String email) {
        return orderRepository.findBySupplierEmail(email);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        order.setStatusUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
}