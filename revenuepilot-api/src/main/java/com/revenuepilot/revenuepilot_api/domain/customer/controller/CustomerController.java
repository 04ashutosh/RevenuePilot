package com.revenuepilot.revenuepilot_api.domain.customer.controller;

import com.revenuepilot.revenuepilot_api.domain.customer.model.Customer;
import com.revenuepilot.revenuepilot_api.domain.customer.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(
            @RequestParam UUID tenantId,
            @RequestParam String name,
            @RequestParam String email){
        return ResponseEntity.ok(customerService.createCustomer(tenantId,name,email));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<Customer>> getCustomersByTenant(@PathVariable UUID tenantId){
        return ResponseEntity.ok(customerService.getCustomerByTenant(tenantId));
    }
}
