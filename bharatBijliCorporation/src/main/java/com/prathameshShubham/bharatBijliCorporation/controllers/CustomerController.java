package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.dto.InvoicesByStatusResponse;
import com.prathameshShubham.bharatBijliCorporation.dto.MonthlyUsageDTO;
import com.prathameshShubham.bharatBijliCorporation.dto.RecordPaymentRequest;
import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import com.prathameshShubham.bharatBijliCorporation.enums.TransactionMethod;
import com.prathameshShubham.bharatBijliCorporation.enums.TransactionStatus;
import com.prathameshShubham.bharatBijliCorporation.exceptions.InsufficientFundsException;
import com.prathameshShubham.bharatBijliCorporation.models.*;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.InvoiceService;
import com.prathameshShubham.bharatBijliCorporation.services.TransactionService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("customers")
public class CustomerController {

    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);
    @Autowired
    private CustomerService customerService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private InvoiceController invoiceController;


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

    @GetMapping("/{customerId}/invoices/{invoiceId}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(invoiceService.getInvoice(invoiceId));
    }

    @GetMapping("/{customerId}/invoices/{invoiceId}/pdf")
    public ResponseEntity<byte[]> getInvoicePdf(@PathVariable String customerId, @PathVariable Long invoiceId) throws  IOException {
        return invoiceController.getInvoicePdf(invoiceId);
    }


    @GetMapping("/{customerId}/invoices/status/{invoiceStatus}")
    public ResponseEntity<InvoicesByStatusResponse> getInvoicesByStatus(@PathVariable String customerId,
                                                                       @PathVariable InvoiceStatus invoiceStatus,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "10") int size) {
        InvoicesByStatusResponse invoicesByStatusResponse = invoiceService.getInvoicesByStatus(customerId,invoiceStatus, page, size);
        return ResponseEntity.ok(invoicesByStatusResponse);
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

    @PostMapping("/record-payment")
    public ResponseEntity<?> recordPayment(@Valid @RequestBody RecordPaymentRequest request) throws Exception {
        Customer customer = customerService.getCustomer(request.getCustomerId());
        Invoice invoice = invoiceService.getInvoice(request.getInvoiceId());

        try {
            Transaction savedTransaction = transactionService.savePaymentByCustomer(request, customer, invoice);
            return new ResponseEntity<>(savedTransaction, HttpStatus.CREATED);
        } catch (InsufficientFundsException e) {
            return ResponseEntity.badRequest().body(Map.of("message","Insufficient Funds"));
        }
    }

    @GetMapping("/{customerId}/usage-last-year")
    public List<MonthlyUsageDTO> getCustomerMonthlyUsageForLastYear(@PathVariable String customerId) {
        return invoiceService.getMonthlyUsageLastYear(customerId);
    }

    @GetMapping("/{customerId}/wallet-balance")
    public ResponseEntity<Map<String,BigDecimal>> getWalletBalance(@PathVariable String customerId) {
        BigDecimal balance = customerService.getWalletBalance(customerId);
        return ResponseEntity.ok(Map.of("balance",balance));
    }
}
