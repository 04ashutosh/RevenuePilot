package com.revenuepilot.revenuepilot_api.domain.subscription.repository;

import com.revenuepilot.revenuepilot_api.domain.subscription.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PlanRepository extends JpaRepository<Plan, UUID> {
    boolean existsByName(String name); // Useful to avoid creating duplicate plans
}
