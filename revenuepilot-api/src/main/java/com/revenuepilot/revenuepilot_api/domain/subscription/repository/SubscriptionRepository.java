package com.revenuepilot.revenuepilot_api.domain.subscription.repository;

import com.revenuepilot.revenuepilot_api.domain.subscription.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription,UUID> {
    List<Subscription> findByCustomerTenantId(UUID tenantId); // All subscriptions for a tenant
    List<Subscription> findByCustomerId(UUID customerId); //All subscriptions for a customer
}
