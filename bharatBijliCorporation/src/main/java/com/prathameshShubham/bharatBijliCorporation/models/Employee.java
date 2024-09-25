package com.prathameshShubham.bharatBijliCorporation.models;

import com.prathameshShubham.bharatBijliCorporation.enums.EmployeeStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "employees")
public class Employee {

    @Id
    private String id;

    @OneToOne(fetch = FetchType.EAGER)                         // personal details would also be loaded instantly
    @JoinColumn(name = "personal_details_id",nullable = false)
    private PersonalDetails personalDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeStatus employeeStatus;
}
