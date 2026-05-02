package com.scraps2stock.backend.controller;

import com.scraps2stock.backend.model.BidOffer;
import com.scraps2stock.backend.model.BidRequest;
import com.scraps2stock.backend.repository.BidOfferRepo;
import com.scraps2stock.backend.repository.BidRequestRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidRequestRepo bidRequestRepo;

    @Autowired
    private BidOfferRepo bidOfferRepo;

    @PostMapping("/request")
    public BidRequest createRequest(@RequestBody BidRequest req) {
        req.setStatus("OPEN");
        req.setAcceptedSupplierEmail(null);
        return bidRequestRepo.save(req);
    }

    @PostMapping("/offer")
    public BidOffer placeOffer(@RequestBody BidOffer offer) {
        offer.setStatus("PENDING");
        return bidOfferRepo.save(offer);
    }

    @GetMapping("/all")
    public List<BidRequest> getAllRequests() {
        return bidRequestRepo.findAll();
    }

    @GetMapping("/offers/{id}")
    public List<BidOffer> getOffers(@PathVariable Long id) {
        return bidOfferRepo.findAll()
                .stream()
                .filter(o -> o.getBidRequestId().equals(id))
                .toList();
    }

    @PutMapping("/accept/{offerId}")
    public BidOffer acceptOffer(@PathVariable Long offerId) {
        BidOffer selectedOffer = bidOfferRepo.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        BidRequest bidRequest = bidRequestRepo.findById(selectedOffer.getBidRequestId())
                .orElseThrow(() -> new RuntimeException("Bid request not found"));

        List<BidOffer> relatedOffers = bidOfferRepo.findAll()
                .stream()
                .filter(o -> o.getBidRequestId().equals(selectedOffer.getBidRequestId()))
                .toList();

        for (BidOffer offer : relatedOffers) {
            if (offer.getId().equals(offerId)) {
                offer.setStatus("ACCEPTED");
            } else {
                offer.setStatus("REJECTED");
            }
            bidOfferRepo.save(offer);
        }

        bidRequest.setStatus("CLOSED");
        bidRequest.setAcceptedSupplierEmail(selectedOffer.getSupplierEmail());
        bidRequestRepo.save(bidRequest);

        return selectedOffer;
    }
}