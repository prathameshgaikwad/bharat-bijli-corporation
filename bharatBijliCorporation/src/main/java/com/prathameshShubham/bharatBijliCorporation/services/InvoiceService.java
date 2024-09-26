package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import com.prathameshShubham.bharatBijliCorporation.models.InvoiceRequest;
import com.prathameshShubham.bharatBijliCorporation.repositories.InvoiceRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepo invoiceRepo;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CustomerService customerService;

    public Invoice saveInvoice(InvoiceRequest invoiceRequest) {
        Invoice invoice = new Invoice();

        invoice.setCustomer(customerService.getCustomer(invoiceRequest.getCustomerId()));
        invoice.setGeneratedByEmployee(employeeService.getEmployee(invoiceRequest.getEmployeeId()));
        invoice.setUnitsConsumed(invoiceRequest.getUnitsConsumed());
        invoice.setTariff(invoiceRequest.getTariff());
        invoice.setPeriodStartDate(invoiceRequest.getPeriodStartDate());
        invoice.setPeriodEndDate(invoiceRequest.getPeriodEndDate());
        invoice.setDueDate(invoiceRequest.getDueDate());
        invoice.setInvoiceStatus(InvoiceStatus.PENDING);

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

    // get a paginated list of the latest invoices belonging to a customer
    public Page<Invoice> getLatestInvoicesForCustomer(String customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return invoiceRepo.findByCustomerOrderByCreatedAt(customerId, pageable);
    }
}
