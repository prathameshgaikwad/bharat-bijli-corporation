package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.models.*;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.InvoiceService;
import com.prathameshShubham.bharatBijliCorporation.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Customer> saveCustomer(@RequestBody CustomerRequest customerRequest) {
        PersonalDetails personalDetails = customerRequest.getPersonalDetails();
        Customer customer = customerRequest.getCustomer();

        return ResponseEntity.ok(customerService.saveCustomer(customer, personalDetails));
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Long customerId){
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
