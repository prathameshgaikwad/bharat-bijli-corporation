package com.prathameshShubham.bharatBijliCorporation.exceptions;

import com.prathameshShubham.bharatBijliCorporation.response.ApiResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateEntryException.class)
    public ResponseEntity<String> duplicateEntryException(DuplicateEntryException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleUserNotFoundException(UserNotFoundException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(InvalidFileFormatException.class)
    public  ResponseEntity<?> handleInvalidFileFormatException(InvalidFileFormatException ex, WebRequest request){
        ApiResponse<?> response = ApiResponse.error(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(EmptyCsvFileException.class)
    public ResponseEntity<ApiResponse<?>> handleEmptyCsvFileException(EmptyCsvFileException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(InvalidDataFormatException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidDataFormatException(InvalidDataFormatException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(InvalidFieldFormatException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidFieldFormatException(InvalidFieldFormatException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MissingFieldException.class)
    public ResponseEntity<ApiResponse<?>> handleMissingFieldException(MissingFieldException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RecordNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleRecordNotFoundException(RecordNotFoundException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
