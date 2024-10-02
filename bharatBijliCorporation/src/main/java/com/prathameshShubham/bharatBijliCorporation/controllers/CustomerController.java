package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.dto.InvoicesByStatusResponse;
import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import com.prathameshShubham.bharatBijliCorporation.models.*;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.InvoiceService;
import com.prathameshShubham.bharatBijliCorporation.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    @GetMapping("/{customerId}")
    public ResponseEntity<Customer> getCustomer(@PathVariable String customerId){
        return ResponseEntity.ok(customerService.getCustomer(customerId));
    }

    @GetMapping("/{customerId}/username")
    public ResponseEntity<Map<String, String>> getCustomerUsername(@PathVariable String customerId){
        String username = customerService.getCustomerUsername(customerId);
        return ResponseEntity.ok(Map.of("username",username));
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

//    @GetMapping("/{customerId}/pending-dues")
//    public ResponseEntity<PendingDuesResponse> getPendingInvoices(@PathVariable String customerId,
//                                              @RequestParam(defaultValue = "0") int page,
//                                              @RequestParam(defaultValue = "10") int size) {
//        PendingDuesResponse pendingDuesResponse = invoiceService.getPendingInvoices(customerId, page, size);
//        return ResponseEntity.ok(pendingDuesResponse);
//    }

    @GetMapping("/{customerId}/invoices/{invoiceStatus}")
    public ResponseEntity<InvoicesByStatusResponse> getOverdueInvoices(@PathVariable String customerId,
                                                                       @PathVariable InvoiceStatus invoiceStatus,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "10") int size) {
        InvoicesByStatusResponse pendingDuesResponse = invoiceService.getInvoicesByStatus(customerId,invoiceStatus, page, size);
        return ResponseEntity.ok(pendingDuesResponse);
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
