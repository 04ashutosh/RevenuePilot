package com.revenuepilot.revenuepilot_api;

import com.revenuepilot.revenuepilot_api.domain.invoice.service.InvoiceService;
import com.revenuepilot.revenuepilot_api.domain.subscription.service.PlanService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class RevenuepilotApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(RevenuepilotApiApplication.class, args);
	}

	@Bean
	CommandLineRunner seedData(PlanService planService, InvoiceService invoiceService){
		return args -> {
			planService.seedDefaultPlans();
			invoiceService.seedDefaultInvoices();
		};
	}
}
