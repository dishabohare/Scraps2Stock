package com.scraps2stock.backend.repository;

import com.scraps2stock.backend.model.BidRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRequestRepo extends JpaRepository<BidRequest, Long> {
}