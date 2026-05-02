package com.scraps2stock.backend.repository;

import com.scraps2stock.backend.model.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByVendorEmail(String vendorEmail);
    List<Dispute> findBySupplierEmail(String supplierEmail);
}
