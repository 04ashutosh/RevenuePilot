package com.revenuepilot.revenuepilot_api.domain.invoice.controller;

import com.revenuepilot.revenuepilot_api.domain.invoice.model.Invoice;
import com.revenuepilot.revenuepilot_api.domain.invoice.model.InvoiceStatus;
import com.revenuepilot.revenuepilot_api.domain.invoice.service.InvoiceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService){
        this.invoiceService = invoiceService;
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<Invoice>> getByTenant(@PathVariable UUID tenantId){
        return ResponseEntity.ok(invoiceService.getInvoicesByTenant(tenantId));
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(
            @RequestParam UUID customerId,
            @RequestParam BigDecimal amount,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate,
            @RequestParam InvoiceStatus status
            ){
        return ResponseEntity.ok(invoiceService.createInvoice(customerId,amount,dueDate,status));
    }
}
