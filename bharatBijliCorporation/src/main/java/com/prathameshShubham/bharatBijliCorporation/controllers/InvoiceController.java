package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import com.prathameshShubham.bharatBijliCorporation.models.InvoiceRequest;
import com.prathameshShubham.bharatBijliCorporation.services.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("invoices")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/{invoiceId}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(invoiceService.getInvoice(invoiceId));
    }

    @PostMapping
    public ResponseEntity<Invoice> saveInvoice(@RequestBody InvoiceRequest invoiceRequest) {
        Invoice invoice = invoiceRequest.getInvoice();
        Long employeeId = invoiceRequest.getEmployeeId();
        return ResponseEntity.ok(invoiceService.saveInvoice(invoice, employeeId));
    }

    @PatchMapping("/{invoiceId}/status")
    public ResponseEntity<Invoice> updateInvoiceStatus(
            @PathVariable Long invoiceId,
            @RequestBody InvoiceStatus invoiceStatus
    ) {
        return ResponseEntity.ok(invoiceService.updateInvoiceStatus(invoiceId, invoiceStatus));
    }
}
