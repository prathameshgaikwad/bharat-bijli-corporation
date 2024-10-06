package com.prathameshShubham.bharatBijliCorporation.exceptions;

public class InsufficientFundsException extends  RuntimeException{

    public InsufficientFundsException() {
        super("Insufficient Funds");
    }

    public InsufficientFundsException(String message) {
        super(message);
    }
}
