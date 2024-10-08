package com.prathameshShubham.bharatBijliCorporation.models;

import com.prathameshShubham.bharatBijliCorporation.enums.ServiceConnectionStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceConnectionStatus serviceConnectionStatus;     // can be "active" or "inactive"

    @OneToOne(fetch = FetchType.EAGER)                           // personal details would also be loaded instantly
    @JoinColumn(name = "personal_details_id", nullable = false)
    private PersonalDetails personalDetails;

    @Column(name = "wallet_balance", nullable = false, columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
    private BigDecimal walletBalance = BigDecimal.ZERO;
}
