package com.revenuepilot.revenuepilot_api.domain.customer.repository;

import com.revenuepilot.revenuepilot_api.domain.customer.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    java.util.List<Customer> findByTenantId(UUID tenantId);
}
