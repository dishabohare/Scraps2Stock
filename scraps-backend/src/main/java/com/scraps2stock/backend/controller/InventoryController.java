package com.scraps2stock.backend.controller;

import com.scraps2stock.backend.model.Inventory;
import com.scraps2stock.backend.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.scraps2stock.backend.model.User;
import com.scraps2stock.backend.repository.UserRepository;
import com.scraps2stock.backend.security.JwtUtil;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InventoryService inventoryService;

    private User getLoggedInUser(String authHeader) {
        String token = JwtUtil.extractTokenFromHeader(authHeader);
        String email = JwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return user;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addInventory(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Inventory inventory) {
        try {
            User user = getLoggedInUser(authHeader);

            if (!"SUPPLIER".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(403).body("Only suppliers can add inventory");
            }

            Inventory saved = inventoryService.addInventory(inventory);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Inventory>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/supplier/{email}")
    public ResponseEntity<List<Inventory>> getSupplierInventory(@PathVariable String email) {
        return ResponseEntity.ok(inventoryService.getSupplierInventory(email));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteInventory(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            User user = getLoggedInUser(authHeader);

            if (!"SUPPLIER".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(403).body("Only suppliers can delete inventory");
            }

            inventoryService.deleteInventory(id);
            return ResponseEntity.ok("Deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateInventory(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody Inventory updated) {
        try {
            User user = getLoggedInUser(authHeader);

            if (!"SUPPLIER".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(403).body("Only suppliers can update inventory");
            }

            Inventory saved = inventoryService.updateInventory(id, updated);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}