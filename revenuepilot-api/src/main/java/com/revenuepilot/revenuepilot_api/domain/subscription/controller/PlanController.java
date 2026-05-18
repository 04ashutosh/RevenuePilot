package com.revenuepilot.revenuepilot_api.domain.subscription.controller;

import com.revenuepilot.revenuepilot_api.domain.subscription.model.Plan;
import com.revenuepilot.revenuepilot_api.domain.subscription.service.PlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController {
    private final PlanService planService;

    public PlanController(PlanService planService){
        this.planService = planService;
    }

    @GetMapping
    public ResponseEntity<List<Plan>> getAllPlans(){
        return ResponseEntity.ok(planService.getAllPlans());
    }

    @PostMapping
    public ResponseEntity<Plan> createPlan(
            @RequestParam String name,
            @RequestParam BigDecimal monthlyPrice,
            @RequestParam String description
            ){
        return ResponseEntity.ok(planService.createPlan(name,monthlyPrice,description));
    }
}
