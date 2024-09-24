package com.prathameshShubham.bharatBijliCorporation.models;

import com.prathameshShubham.bharatBijliCorporation.enums.Customer.ConnectionStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "customers")
public class Customer {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  private ConnectionStatus connectionStatus;     // can be "active" or "inactive"

  @OneToOne
  private PersonalDetails personalDetails;
}
