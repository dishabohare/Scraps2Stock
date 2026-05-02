package com.scraps2stock.backend.controller;

import com.scraps2stock.backend.model.Dispute;
import com.scraps2stock.backend.repository.DisputeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/disputes")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173", "http://localhost:8082"})
public class DisputeController {

    @Autowired
    private DisputeRepository disputeRepository;

    @GetMapping
    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dispute> getDisputeById(@PathVariable Long id) {
        Optional<Dispute> dispute = disputeRepository.findById(id);
        return dispute.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Dispute createDispute(@RequestBody Dispute dispute) {
        if (dispute.getStatus() == null || dispute.getStatus().isEmpty()) {
            dispute.setStatus("Open");
        }
        return disputeRepository.save(dispute);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Dispute> updateDisputeStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Dispute> optionalDispute = disputeRepository.findById(id);
        if (optionalDispute.isPresent()) {
            Dispute dispute = optionalDispute.get();
            String status = payload.get("status");
            if (status != null) {
                dispute.setStatus(status);
                Dispute updatedDispute = disputeRepository.save(dispute);
                return ResponseEntity.ok(updatedDispute);
            }
        }
        return ResponseEntity.notFound().build();
    }
}
