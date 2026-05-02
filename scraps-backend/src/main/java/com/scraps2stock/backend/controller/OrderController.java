package com.scraps2stock.backend.controller;

import com.scraps2stock.backend.model.Order;
import com.scraps2stock.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.scraps2stock.backend.model.User;
import com.scraps2stock.backend.repository.UserRepository;
import com.scraps2stock.backend.security.JwtUtil;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderService orderService;

    private User getLoggedInUser(String authHeader) {
        String token = JwtUtil.extractTokenFromHeader(authHeader);
        String email = JwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return user;
    }

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Order order) {
        try {
            User user = getLoggedInUser(authHeader);

            if (!"VENDOR".equals(user.getRole())) {
                return ResponseEntity.status(403).body("Only vendors can place orders");
            }

            Order savedOrder = orderService.placeOrder(order);
            return ResponseEntity.ok(savedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/vendor/{email}")
    public ResponseEntity<List<Order>> getVendorOrders(@PathVariable String email) {
        return ResponseEntity.ok(orderService.getVendorOrders(email));
    }

    @GetMapping("/supplier/{email}")
    public ResponseEntity<List<Order>> getSupplierOrders(@PathVariable String email) {
        return ResponseEntity.ok(orderService.getSupplierOrders(email));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}