package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.models.*;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.InvoiceService;
import com.prathameshShubham.bharatBijliCorporation.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Customer> saveCustomer(@RequestBody PersonalDetails personalDetails) {
        return ResponseEntity.ok(customerService.saveCustomer(personalDetails));
    }

    // Endpoint to save a csv file of customers
    @PostMapping("/bulk-csv-upload")
    public ResponseEntity<String> saveCustomers(@RequestParam("file") MultipartFile file) {
        try {
            List<PersonalDetails> personalDetailsList = customerService.parseCsvToCustomers(file);
            customerService.saveCustomers(personalDetailsList);
            return ResponseEntity.ok("Customers saved successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save customers: " + e.getMessage());
        }
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<Customer> getCustomer(@PathVariable String customerId){
        return ResponseEntity.ok(customerService.getCustomer(customerId));
    }

    // Endpoint to fetch paginated list of invoices of a customer by customerId
    @GetMapping("/{customerId}/invoices")
    public ResponseEntity<Page<Invoice>> getCustomerInvoices(
            @PathVariable String customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Invoice> invoices = invoiceService.getLatestInvoicesForCustomer(customerId, page, size);
        return ResponseEntity.ok(invoices);
    }

    // Endpoint to fetch paginated list of latest transactions done by a customer
    @GetMapping("/{customerId}/transactions")
    public ResponseEntity<Page<Transaction>> getCustomerTransactions(
            @PathVariable String customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Transaction> transactions = transactionService.getLatestTransactionsByCustomer(customerId, page, size);
        return ResponseEntity.ok(transactions);
    }
}
