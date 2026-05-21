package com.revenuepilot.revenuepilot_api.domain.invoice.service;

import com.revenuepilot.revenuepilot_api.domain.customer.model.Customer;
import com.revenuepilot.revenuepilot_api.domain.customer.repository.CustomerRepository;
import com.revenuepilot.revenuepilot_api.domain.invoice.model.Invoice;
import com.revenuepilot.revenuepilot_api.domain.invoice.model.InvoiceStatus;
import com.revenuepilot.revenuepilot_api.domain.invoice.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;

    public InvoiceService(InvoiceRepository invoiceRepository, CustomerRepository customerRepository){
        this.invoiceRepository = invoiceRepository;
        this.customerRepository = customerRepository;
    }

    public List<Invoice> getInvoicesByTenant(UUID tenantId){
        return invoiceRepository.findByCustomerTenantId(tenantId);
    }

    public Invoice createInvoice(UUID customerId, BigDecimal amount, LocalDate dueDate, InvoiceStatus status){
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(()-> new RuntimeException("Customer not found!"));

        Invoice invoice = new Invoice();
        invoice.setCustomer(customer);
        invoice.setAmount(amount);
        invoice.setDueDate(dueDate);
        invoice.setStatus(status);

        return invoiceRepository.save(invoice);
    }

    // Seeds mock invoices for any customer that currently exists
    public void seedDefaultInvoices(){
        if (invoiceRepository.count()==0){
            List<Customer> customers = customerRepository.findAll();
            for (Customer customer : customers){
                // Seed a paid invoice
                createInvoice(customer.getId(),new BigDecimal("199.00"),LocalDate.now().minusDays(15),InvoiceStatus.PAID);
                // Seed a pending invoice
                createInvoice(customer.getId(),new BigDecimal("49.00"),LocalDate.now().plusDays(10),InvoiceStatus.PENDING);
            }
        }
    }
}
