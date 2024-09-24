package com.prathameshShubham.bharatBijliCorporation.enums;

public enum TransactionStatus {
    SUCCESS,             // successful payment
    PENDING,             // not yet paid
    FAILED,              // did not complete due to technical, network, or processing errors
    CANCELLED,           // cancelled by the customer
    DECLINED,            // rejected by payment gateway/processor or bank
    EXPIRED,             // timed out
}
