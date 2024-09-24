package com.prathameshShubham.bharatBijliCorporation.models;


import com.prathameshShubham.bharatBijliCorporation.enums.Invoice.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany
    private Customer customerId;

    @OneToOne
    private Employee generatedByEmployeeId;

    private Double unitsConsumed;
    private Double tariff;
    private LocalDateTime periodStartDate;
    private LocalDateTime periodEndDate;
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(updatable = false)
    private LocalDateTime createdAt;           // make it non updatable

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();      // automatically set createdAt when record is created
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();      // automatically set updatedAt when record is updated
    }
}
