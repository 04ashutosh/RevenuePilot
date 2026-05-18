package com.revenuepilot.revenuepilot_api.domain.subscription.controller;

import com.revenuepilot.revenuepilot_api.domain.subscription.model.Subscription;
import com.revenuepilot.revenuepilot_api.domain.subscription.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService){
        this.subscriptionService = subscriptionService;
    }

    @PostMapping
    public ResponseEntity<Subscription> createSubscription(
            @RequestParam UUID customerId,
            @RequestParam UUID planId
            ){
        return ResponseEntity.ok(subscriptionService.createSubscription(customerId,planId));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<Subscription>> getByTenant(@PathVariable UUID tenantId){
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByTenant(tenantId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Subscription>> getByCustomer(@PathVariable UUID customerId){
        return ResponseEntity.ok(subscriptionService.getSubscriptionByCustomer(customerId));
    }
}
