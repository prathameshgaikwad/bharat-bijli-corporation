package com.prathameshShubham.bharatBijliCorporation.exceptions;

import jakarta.persistence.EntityNotFoundException;

public class RecordNotFoundException extends EntityNotFoundException {
    public RecordNotFoundException(String message) {
        super(message);
    }
}
