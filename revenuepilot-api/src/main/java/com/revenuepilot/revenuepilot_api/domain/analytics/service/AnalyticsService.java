package com.revenuepilot.revenuepilot_api.domain.analytics.service;

import com.revenuepilot.revenuepilot_api.domain.invoice.model.Invoice;
import com.revenuepilot.revenuepilot_api.domain.invoice.model.InvoiceStatus;
import com.revenuepilot.revenuepilot_api.domain.invoice.repository.InvoiceRepository;
import com.revenuepilot.revenuepilot_api.domain.subscription.model.Subscription;
import com.revenuepilot.revenuepilot_api.domain.subscription.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;

@Service
public class AnalyticsService {
    private final SubscriptionRepository subscriptionRepository;
    private final InvoiceRepository invoiceRepository;

    public AnalyticsService(SubscriptionRepository subscriptionRepository, InvoiceRepository invoiceRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public List<Map<String, Object>> getMrrHistory(UUID tenantId) {
        List<Map<String, Object>> history = new ArrayList<>();
        List<Subscription> subscriptions = subscriptionRepository.findByCustomerTenantId(tenantId);
        LocalDate today = LocalDate.now();

        // Calculate MRR for each of the last 6 months
        for (int i = 5; i >= 0; i--) {
            LocalDate targetDate = today.minusMonths(i);
            LocalDate startOfMonth = targetDate.withDayOfMonth(1);
            LocalDate endOfMonth = targetDate.withDayOfMonth(targetDate.lengthOfMonth());

            BigDecimal mrrSum = BigDecimal.ZERO;
            for (Subscription sub : subscriptions) {
                if ("ACTIVE".equalsIgnoreCase(sub.getStatus())) {
                    LocalDate subStart = sub.getStartDate().toLocalDate();
                    LocalDate subEnd = sub.getEndDate() != null ? sub.getEndDate().toLocalDate() : null;

                    // Subscription was active during this month if:
                    // 1. It started before or during this month
                    // 2. It has not ended, or ended after or during this month
                    boolean startedBeforeOrDuring = !subStart.isAfter(endOfMonth);
                    boolean endedAfterOrDuring = (subEnd == null) || !subEnd.isBefore(startOfMonth);

                    if (startedBeforeOrDuring && endedAfterOrDuring) {
                        mrrSum = mrrSum.add(sub.getPlan().getMonthlyPrice());
                    }
                }
            }

            String monthName = targetDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("month", monthName);
            dataPoint.put("mrr", mrrSum);
            history.add(dataPoint);
        }

        return history;
    }

    public Map<String, Integer> getSubscriptionsDistribution(UUID tenantId) {
        List<Subscription> subscriptions = subscriptionRepository.findByCustomerTenantId(tenantId);
        Map<String, Integer> distribution = new HashMap<>();

        // Initialize default tiers so charts render correctly even with 0 counts
        distribution.put("FREE", 0);
        distribution.put("PRO", 0);
        distribution.put("ENTERPRISE", 0);

        for (Subscription sub : subscriptions) {
            if ("ACTIVE".equalsIgnoreCase(sub.getStatus())) {
                String planName = sub.getPlan().getName().toUpperCase();
                distribution.put(planName, distribution.getOrDefault(planName, 0) + 1);
            }
        }
        return distribution;
    }

    public Map<String, BigDecimal> getInvoicesStatusDistribution(UUID tenantId) {
        List<Invoice> invoices = invoiceRepository.findByCustomerTenantId(tenantId);
        Map<String, BigDecimal> distribution = new HashMap<>();
        distribution.put("PAID", BigDecimal.ZERO);
        distribution.put("PENDING", BigDecimal.ZERO);
        distribution.put("OVERDUE", BigDecimal.ZERO);

        for (Invoice invoice : invoices) {
            String status = invoice.getStatus().name();
            BigDecimal amount = invoice.getAmount();
            distribution.put(status, distribution.get(status).add(amount));
        }
        return distribution;
    }
}
