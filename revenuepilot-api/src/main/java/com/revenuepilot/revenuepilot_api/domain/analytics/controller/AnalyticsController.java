package com.revenuepilot.revenuepilot_api.domain.analytics.controller;

import com.revenuepilot.revenuepilot_api.domain.analytics.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/tenant/{tenantId}/mrr-history")
    public ResponseEntity<List<Map<String, Object>>> getMrrHistory(@PathVariable UUID tenantId) {
        return ResponseEntity.ok(analyticsService.getMrrHistory(tenantId));
    }

    @GetMapping("/tenant/{tenantId}/subscriptions-distribution")
    public ResponseEntity<Map<String, Integer>> getSubscriptionsDistribution(@PathVariable UUID tenantId) {
        return ResponseEntity.ok(analyticsService.getSubscriptionsDistribution(tenantId));
    }

    @GetMapping("/tenant/{tenantId}/invoices-status")
    public ResponseEntity<Map<String, BigDecimal>> getInvoicesStatus(@PathVariable UUID tenantId) {
        return ResponseEntity.ok(analyticsService.getInvoicesStatusDistribution(tenantId));
    }
}
