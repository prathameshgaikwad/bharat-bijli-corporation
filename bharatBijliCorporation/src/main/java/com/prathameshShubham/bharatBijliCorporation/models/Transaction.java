package com.prathameshShubham.bharatBijliCorporation.models;

import com.prathameshShubham.bharatBijliCorporation.enums.TransactionMethod;
import com.prathameshShubham.bharatBijliCorporation.enums.TransactionStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Invoice invoice;

    @OneToMany
    private Customer customer;

    private Double amount;
    private TransactionMethod transactionMethod;

    @Lob
    private String description;

    private Double transactionFee;
    private String transactionReference;

    @Enumerated(EnumType.STRING)
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
