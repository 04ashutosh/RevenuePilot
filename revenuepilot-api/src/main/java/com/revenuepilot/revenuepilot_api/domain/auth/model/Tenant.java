package com.revenuepilot.revenuepilot_api.domain.auth.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tenants")
@Data
public class Tenant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false,unique = true)
    private String companyName;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // This method runs automatically right before the object is saved to the databse for the first time
    @PrePersist
    protected void onCreate(){
        this.createdAt = LocalDateTime.now();
    }
}
