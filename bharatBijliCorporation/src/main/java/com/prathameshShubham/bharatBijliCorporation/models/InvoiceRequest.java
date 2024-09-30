package com.prathameshShubham.bharatBijliCorporation.models;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InvoiceRequest {
    private LocalDateTime dueDate;
    private LocalDateTime periodStartDate;
    private LocalDateTime periodEndDate;
    private double tariff;
    private double unitsConsumed;
    private String customerId;
    private String employeeId;
}
