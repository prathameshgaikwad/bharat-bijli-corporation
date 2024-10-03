package com.prathameshShubham.bharatBijliCorporation.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
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

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnore
    private Employee generatedByEmployee;

    @Column(nullable = false)
    private Double unitsConsumed;

    @Column(nullable = false)
    private Double tariff = 41.5;

    @Column(nullable = false)
    private LocalDateTime periodStartDate;

    @Column(nullable = false)
    private LocalDateTime periodEndDate;

    @Column(nullable = false)
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus invoiceStatus;

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
