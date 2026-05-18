package com.revenuepilot.revenuepilot_api.domain.subscription.service;

import com.revenuepilot.revenuepilot_api.domain.subscription.model.Plan;
import com.revenuepilot.revenuepilot_api.domain.subscription.repository.PlanRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PlanService {
    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository){
        this.planRepository = planRepository;
    }

    public List<Plan> getAllPlans(){
        return planRepository.findAll();
    }

    public Plan createPlan(String name, BigDecimal monthlyPrice, String description){
        if (planRepository.existsByName(name)){
            throw new RuntimeException("Plan '" + name + "' already exists!");
        }

        Plan plan = new Plan();
        plan.setName(name);
        plan.setMonthlyPrice(monthlyPrice);
        plan.setDescription(description);

        return planRepository.save(plan);
    }

    // Seed default plans if none exist - called on startup
    public void seedDefaultPlans(){
        if (planRepository.count()==0){
            createPlan("FREE",       BigDecimal.valueOf(0.00),   "Up to 3 seats, basic features");
            createPlan("PRO",        BigDecimal.valueOf(49.00),  "Up to 20 seats, advanced analytics");
            createPlan("ENTERPRISE", BigDecimal.valueOf(199.00), "Unlimited seats, priority support");
        }
    }
}
