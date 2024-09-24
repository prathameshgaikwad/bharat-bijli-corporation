package com.prathameshShubham.bharatBijliCorporation.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "personal_details")
public class PersonalDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String emailId;
    private Integer phoneNumber;

    @Lob
    private String address;    // marked as large object

    private String city;
    private Integer pincode;
    private String state;
    private LocalDate dateOfBirth;

    @Column(updatable = false)
    private LocalDateTime createdAt;  // make it non updatable

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();     // automatically set createdAt when record is created
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();      // automatically set updatedAt when record is updated
    }
}
