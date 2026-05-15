package com.revenuepilot.revenuepilot_api.domain.auth.service;

import com.revenuepilot.revenuepilot_api.domain.auth.model.Tenant;
import com.revenuepilot.revenuepilot_api.domain.auth.repository.TenantRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TenantService {
    private final TenantRepository tenantRepository;

    public TenantService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    public Tenant createTenant(String companyName) {
        Tenant tenant = new Tenant();
        tenant.setCompanyName(companyName);
        return tenantRepository.save(tenant);
    }
    public List<Tenant> getAllTenants() { return tenantRepository.findAll(); }
}
