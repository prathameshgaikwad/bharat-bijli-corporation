package com.prathameshShubham.bharatBijliCorporation.models;

import com.prathameshShubham.bharatBijliCorporation.enums.TransactionMethod;
import com.prathameshShubham.bharatBijliCorporation.enums.TransactionStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @NotNull
    @Column(nullable = false,columnDefinition = "DOUBLE DEFAULT 0.0")
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionMethod transactionMethod;

    @Lob
    private String description;

    @Column(nullable = false)
    private BigDecimal discountByDueDate;

    @Column(nullable = false)
    private BigDecimal discountByOnlinePayment;

    @Column(nullable = false)
    private LocalDate transactionDate;

    @Column(nullable = false)
    private String transactionReference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus transactionStatus;


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
