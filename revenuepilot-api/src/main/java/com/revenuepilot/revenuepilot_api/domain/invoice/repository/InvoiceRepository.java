package com.revenuepilot.revenuepilot_api.domain.invoice.repository;

import com.revenuepilot.revenuepilot_api.domain.invoice.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    // Traverse Customer entity to find Tenant ID
    List<Invoice> findByCustomerTenantId(UUID tenantId);
}
