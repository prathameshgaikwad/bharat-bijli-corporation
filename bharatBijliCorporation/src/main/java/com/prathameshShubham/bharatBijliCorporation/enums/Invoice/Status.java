package com.prathameshShubham.bharatBijliCorporation.enums.Invoice;

public enum Status {
    PENDING,                   // invoice generated and yet to be paid
    PAID,                      // invoice that has been paid
    PARTIALLY_PAID,            // partial payment of invoice completed
    OVERDUE,                   // customer missed the due date to make payment
    VOID,                      // invalid invoice
}
