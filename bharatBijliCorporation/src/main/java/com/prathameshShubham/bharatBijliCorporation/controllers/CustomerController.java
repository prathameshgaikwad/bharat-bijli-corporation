package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.CustomerRequest;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.InvoiceService;
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

    @PostMapping
    public ResponseEntity<Customer> saveCustomer(@RequestBody PersonalDetails personalDetails) {
        return ResponseEntity.ok(customerService.saveCustomer(personalDetails));
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
}
