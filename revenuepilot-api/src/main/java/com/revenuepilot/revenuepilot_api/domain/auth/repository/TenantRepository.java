package com.revenuepilot.revenuepilot_api.domain.auth.repository;

import com.revenuepilot.revenuepilot_api.domain.auth.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    // By simply extending JpaRepository, Spring automatically generates all the SQL for:
    // save(), findById(), findAll(), deleteById(), etc.
}
