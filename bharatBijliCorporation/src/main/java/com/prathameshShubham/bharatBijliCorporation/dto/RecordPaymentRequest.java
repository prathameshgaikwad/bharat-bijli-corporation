package com.prathameshShubham.bharatBijliCorporation.dto;

import com.prathameshShubham.bharatBijliCorporation.enums.TransactionMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class RecordPaymentRequest {

    @NotBlank(message = "Customer ID is required")
    private String customerId;

    @NotNull(message = "Invoice ID is required")
    private Long invoiceId;

    @NotNull(message = "Total amount is required")
    @Min(value = 0, message = "Total amount must be greater than zero")
    private Double totalAmount;

    @DecimalMin(value = "0.0", message = "Discount by due date must be non-negative")
    private BigDecimal discountByDueDate;

    @DecimalMin(value = "0.0", message = "Discount by online payment must be non-negative")
    private BigDecimal discountByOnlinePayment;

    @NotNull(message = "Payment method is required")
    private TransactionMethod paymentMethod;

    private String paymentDescription;

    @NotBlank(message = "Transaction reference is required")
    private String transactionReference;

    @NotNull(message = "Transaction date is required")
    private LocalDate transactionDate;


}
