package com.revenuepilot.revenuepilot_api.domain.auth.controller;

import com.revenuepilot.revenuepilot_api.domain.auth.model.Tenant;
import com.revenuepilot.revenuepilot_api.domain.auth.service.TenantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {
    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @PostMapping
    public ResponseEntity<Tenant> createTenant(@RequestParam String companyName) {
        return ResponseEntity.ok(tenantService.createTenant(companyName));
    }
    @GetMapping
    public ResponseEntity<List<Tenant>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }
}
