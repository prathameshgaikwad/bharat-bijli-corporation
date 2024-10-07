package com.prathameshShubham.bharatBijliCorporation.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InvoiceRequest {
    @NotNull(message = "Due date cannot be null")
//    @FutureOrPresent(message = "Due date must be today or in the future")
    private LocalDateTime dueDate;

    @NotNull(message = "Period start date cannot be null")
    @PastOrPresent(message = "Period start date cannot be in the future")
    private LocalDateTime periodStartDate;

    @NotNull(message = "Period end date cannot be null")
//    @FutureOrPresent(message = "Period end date cannot be in the future")
    private LocalDateTime periodEndDate;

    @Positive(message = "Tariff must be a positive value")
    private double tariff;

    @PositiveOrZero(message = "Units consumed cannot be negative")
    private double unitsConsumed;

    @NotBlank(message = "Customer ID cannot be blank")
    private String customerId;

    @NotBlank(message = "Employee ID cannot be blank")
    private String employeeId;
}
