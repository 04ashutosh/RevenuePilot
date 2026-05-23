package com.revenuepilot.revenuepilot_api.domain.ai.service;

import com.revenuepilot.revenuepilot_api.domain.auth.model.Tenant;
import com.revenuepilot.revenuepilot_api.domain.auth.repository.TenantRepository;
import com.revenuepilot.revenuepilot_api.domain.customer.model.Customer;
import com.revenuepilot.revenuepilot_api.domain.customer.repository.CustomerRepository;
import com.revenuepilot.revenuepilot_api.domain.invoice.model.Invoice;
import com.revenuepilot.revenuepilot_api.domain.invoice.model.InvoiceStatus;
import com.revenuepilot.revenuepilot_api.domain.invoice.repository.InvoiceRepository;
import com.revenuepilot.revenuepilot_api.domain.subscription.model.Subscription;
import com.revenuepilot.revenuepilot_api.domain.subscription.repository.SubscriptionRepository;
import com.revenuepilot.revenuepilot_api.domain.ai.config.OllamaConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class OllamaService {
    private final TenantRepository tenantRepository;
    private final CustomerRepository customerRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final InvoiceRepository invoiceRepository;
    private final OllamaConfig ollamaConfig;
    private final RestTemplate restTemplate = new RestTemplate();

    public OllamaService(TenantRepository tenantRepository,
                         CustomerRepository customerRepository,
                         SubscriptionRepository subscriptionRepository,
                         InvoiceRepository invoiceRepository,
                         OllamaConfig ollamaConfig) {
        this.tenantRepository = tenantRepository;
        this.customerRepository = customerRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.invoiceRepository = invoiceRepository;
        this.ollamaConfig = ollamaConfig;
    }

    public String generateChatResponse(UUID tenantId, String userMessage) {
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        List<Customer> customers = customerRepository.findByTenantId(tenantId);
        List<Subscription> subscriptions = subscriptionRepository.findByCustomerTenantId(tenantId);
        List<Invoice> invoices = invoiceRepository.findByCustomerTenantId(tenantId);

        // 1. Calculate active customer count
        long activeCustomerCount = customers.stream()
                .filter(c -> "ACTIVE".equalsIgnoreCase(c.getStatus()))
                .count();

        // 2. Calculate real-time MRR and Plan tier distributions
        BigDecimal mrr = BigDecimal.ZERO;
        Map<String, Integer> planDistribution = new HashMap<>();
        for (Subscription sub : subscriptions) {
            if ("ACTIVE".equalsIgnoreCase(sub.getStatus())) {
                BigDecimal price = sub.getPlan().getMonthlyPrice();
                mrr = mrr.add(price);
                String planName = sub.getPlan().getName();
                planDistribution.put(planName, planDistribution.getOrDefault(planName, 0) + 1);
            }
        }

        // 3. Summarize billing collections and outstanding debt
        BigDecimal totalOutstanding = BigDecimal.ZERO;
        BigDecimal totalPaid = BigDecimal.ZERO;
        int overdueCount = 0;
        for (Invoice inv : invoices) {
            if (InvoiceStatus.OVERDUE == inv.getStatus()) {
                totalOutstanding = totalOutstanding.add(inv.getAmount());
                overdueCount++;
            } else if (InvoiceStatus.PENDING == inv.getStatus()) {
                totalOutstanding = totalOutstanding.add(inv.getAmount());
            } else if (InvoiceStatus.PAID == inv.getStatus()) {
                totalPaid = totalPaid.add(inv.getAmount());
            }
        }

        // 4. Construct the contextual prompt for the LLM
        StringBuilder context = new StringBuilder();
        context.append("You are RevenuePilot AI, a virtual CFO and billing specialist for a B2B SaaS platform.\n");
        context.append("Here is the real-time financial data for the company \"")
                .append(tenant.getCompanyName()).append("\":\n");
        context.append("- Active Customers: ").append(activeCustomerCount).append("\n");
        context.append("- Monthly Recurring Revenue (MRR): $").append(mrr).append("\n");
        context.append("- Annual Run Rate (ARR): $").append(mrr.multiply(BigDecimal.valueOf(12))).append("\n");
        context.append("- Subscription distributions: ").append(planDistribution).append("\n");
        context.append("- Total Invoiced Amount: $").append(totalPaid.add(totalOutstanding)).append("\n");
        context.append("- Outstanding Balance: $").append(totalOutstanding).append("\n");
        context.append("- Overdue Invoices Count: ").append(overdueCount).append("\n\n");
        context.append("Answer the user's question concisely based on the data above. Provide actionable ideas for optimization.\n");
        context.append("User question: ").append(userMessage).append("\n\nResponse:");

        return callOllama(context.toString());
    }

    public String generateOverdueEmailDraft(UUID invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        Customer customer = invoice.getCustomer();
        Tenant tenant = customer.getTenant();
        long daysOverdue = LocalDate.now().toEpochDay() - invoice.getDueDate().toEpochDay();
        if (daysOverdue < 0) {
            daysOverdue = 0; // Due soon, not late yet
        }

        // Construct the mail prompt
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are the automated billing specialist at ").append(tenant.getCompanyName()).append(".\n");
        prompt.append("Write a personalized collection email reminder for our customer:\n");
        prompt.append("- Customer Name: ").append(customer.getName()).append("\n");
        prompt.append("- Invoice Amount: $").append(invoice.getAmount()).append("\n");
        prompt.append("- Due Date: ").append(invoice.getDueDate()).append("\n");
        prompt.append("- Days Overdue: ").append(daysOverdue).append("\n\n");
        prompt.append("Guidelines:\n");
        if (daysOverdue == 0) {
            prompt.append("- Tone: Professional, polite, early notice. It is due today or very soon.\n");
        } else if (daysOverdue < 10) {
            prompt.append("- Tone: Direct, soft reminder. The payment is slightly late.\n");
        } else {
            prompt.append("- Tone: Firm, urgent. The payment is significantly late.\n");
        }
        prompt.append("- Do not use brackets like [Your Name] or placeholders. Sign the email as \"Billing Operations Team at ").append(tenant.getCompanyName()).append("\".\n");
        prompt.append("- Output ONLY the Subject line and the Email Body.");

        return callOllama(prompt.toString());
    }

    private String callOllama(String prompt) {
        String endpoint = ollamaConfig.getUrl() + "/api/generate";

        Map<String, Object> requestPayload = new HashMap<>();
        requestPayload.put("model", ollamaConfig.getModel());
        requestPayload.put("prompt", prompt);
        requestPayload.put("stream", false);

        try {
            Map<String, Object> response = restTemplate.postForObject(endpoint, requestPayload, Map.class);
            if (response != null && response.containsKey("response")) {
                return (String) response.get("response");
            }
            return "Error: Empty response from Ollama.";
        } catch (Exception e) {
            return "Error calling local Ollama at " + ollamaConfig.getUrl()
                    + ". Make sure Ollama is running and has model '" + ollamaConfig.getModel() + "' installed.";
        }
    }
}