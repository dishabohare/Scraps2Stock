package com.scraps2stock.backend.service;

import com.scraps2stock.backend.model.Inventory;
import com.scraps2stock.backend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public Inventory addInventory(Inventory inventory) {
        if (inventory.getStatus() == null || inventory.getStatus().isEmpty()) {
            inventory.setStatus("ACTIVE");
        }
        return inventoryRepository.save(inventory);
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public List<Inventory> getSupplierInventory(String supplierEmail) {
        return inventoryRepository.findBySupplierEmail(supplierEmail);
    }

    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }

    public Inventory updateInventory(Long id, Inventory updated) {
        Inventory existing = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        existing.setProductName(updated.getProductName());
        existing.setCategory(updated.getCategory());
        existing.setQuantity(updated.getQuantity());
        existing.setPrice(updated.getPrice());
        existing.setLocation(updated.getLocation());
        existing.setExpiryDate(updated.getExpiryDate());

        return inventoryRepository.save(existing);
    }
}