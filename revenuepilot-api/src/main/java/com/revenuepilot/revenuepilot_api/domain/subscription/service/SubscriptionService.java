package com.revenuepilot.revenuepilot_api.domain.subscription.service;

import com.revenuepilot.revenuepilot_api.domain.customer.model.Customer;
import com.revenuepilot.revenuepilot_api.domain.customer.repository.CustomerRepository;
import com.revenuepilot.revenuepilot_api.domain.subscription.model.Plan;
import com.revenuepilot.revenuepilot_api.domain.subscription.model.Subscription;
import com.revenuepilot.revenuepilot_api.domain.subscription.repository.PlanRepository;
import com.revenuepilot.revenuepilot_api.domain.subscription.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final CustomerRepository customerRepository;
    private final PlanRepository planRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                               CustomerRepository customerRepository,
                               PlanRepository planRepository){
        this.subscriptionRepository = subscriptionRepository;
        this.customerRepository = customerRepository;
        this.planRepository = planRepository;
    }

    public Subscription createSubscription(UUID customerId, UUID planId){
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(()->new RuntimeException("Customer not found!"));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(()-> new RuntimeException("Plan not found!"));

        Subscription subscription = new Subscription();
        subscription.setCustomer(customer);
        subscription.setPlan(plan);
        return subscriptionRepository.save(subscription);
    }

    public List<Subscription> getSubscriptionsByTenant(UUID tenantId){
        return subscriptionRepository.findByCustomerTenantId(tenantId);
    }

    public List<Subscription> getSubscriptionByCustomer(UUID customerId){
        return subscriptionRepository.findByCustomerId(customerId);
    }
}
