package com.prathameshShubham.bharatBijliCorporation.models;

import com.prathameshShubham.bharatBijliCorporation.enums.Employee.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private PersonalDetails personalDetails;

    @Enumerated(EnumType.STRING)
    private Status status;
}
