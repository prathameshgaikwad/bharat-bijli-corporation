package com.prathameshShubham.bharatBijliCorporation.exceptions;

public class InvoiceAlreadyPaidException extends RuntimeException{

    public  InvoiceAlreadyPaidException() {
        super("Invoice has already been paid");
    }
}
