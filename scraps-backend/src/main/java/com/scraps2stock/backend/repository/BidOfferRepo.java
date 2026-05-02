package com.scraps2stock.backend.repository;

import com.scraps2stock.backend.model.BidOffer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidOfferRepo extends JpaRepository<BidOffer, Long> {
}