package com.prathameshShubham.bharatBijliCorporation.models;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class InvoiceRequest {
    private LocalDateTime dueDate;
    private LocalDateTime periodStartDate;
    private LocalDateTime periodEndDate;
    private double tariff;
    private double unitsConsumed;
    private String customerId;
    private String employeeId;
}
