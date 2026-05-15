package com.revenuepilot.revenuepilot_api.domain.customer.service;

import com.revenuepilot.revenuepilot_api.domain.auth.model.Tenant;
import com.revenuepilot.revenuepilot_api.domain.auth.repository.TenantRepository;
import com.revenuepilot.revenuepilot_api.domain.customer.model.Customer;
import com.revenuepilot.revenuepilot_api.domain.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final TenantRepository tenantRepository;

    public CustomerService(CustomerRepository customerRepository, TenantRepository tenantRepository) {
        this.customerRepository = customerRepository;
        this.tenantRepository = tenantRepository;
    }

    public Customer createCustomer(UUID tenantId, String name, String email){
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(()-> new RuntimeException("Tenant not found!"));

        Customer customer = new Customer();
        customer.setTenant(tenant);
        customer.setName(name);
        customer.setEmail(email);

        return customerRepository.save(customer);
    }
    public List<Customer> getCustomerByTenant(UUID tenantId){
        return customerRepository.findByTenantId(tenantId);
    }
}
