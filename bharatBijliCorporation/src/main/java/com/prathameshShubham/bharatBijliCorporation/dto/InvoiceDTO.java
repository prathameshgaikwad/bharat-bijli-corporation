package com.prathameshShubham.bharatBijliCorporation.dto;

import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InvoiceDTO {
    private Long id;
    private double unitsConsumed;
    private double tariff;
    private LocalDateTime periodStartDate;
    private LocalDateTime periodEndDate;
    private LocalDateTime dueDate;
    private InvoiceStatus invoiceStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
