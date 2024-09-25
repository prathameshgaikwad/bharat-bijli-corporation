package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import com.prathameshShubham.bharatBijliCorporation.models.Employee;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import com.prathameshShubham.bharatBijliCorporation.repositories.InvoiceRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepo invoiceRepo;

    public Invoice saveInvoice(Invoice invoice, Employee employee) {
        invoice.setGeneratedByEmployee(employee);
        return invoiceRepo.save(invoice);
    }

    public Invoice getInvoice(Long invoiceId) {
        return invoiceRepo
                .findById(invoiceId)
                .orElseThrow(() -> (
                        new EntityNotFoundException("Invoice not found with the ID: " + invoiceId)
                        )
                );
    }

    public Invoice updateInvoiceStatus(Long invoiceId, InvoiceStatus status) {
        Invoice invoice = getInvoice(invoiceId);
        invoice.setInvoiceStatus(status);
        return invoiceRepo.save(invoice);
    }

}
