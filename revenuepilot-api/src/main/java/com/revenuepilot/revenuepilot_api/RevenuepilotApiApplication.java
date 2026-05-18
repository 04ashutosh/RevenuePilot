package com.revenuepilot.revenuepilot_api;

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

	// This runs once after Spring Boot starts up
	@Bean
	CommandLineRunner seedData(PlanService planService){
		return args -> planService.seedDefaultPlans();
	}

}
