package com.prathameshShubham.bharatBijliCorporation.services;

import com.opencsv.CSVReader;
import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import com.prathameshShubham.bharatBijliCorporation.exceptions.EmptyCsvFileException;
import com.prathameshShubham.bharatBijliCorporation.exceptions.InvalidFileFormatException;
import com.prathameshShubham.bharatBijliCorporation.exceptions.MissingFieldException;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import com.prathameshShubham.bharatBijliCorporation.models.InvoiceRequest;
import com.prathameshShubham.bharatBijliCorporation.repositories.InvoiceRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

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

    public Page<Invoice> getInvoicesByEmployeeId(String employeeId, int page, int size) {
        return invoiceRepo.findByGeneratedByEmployeeId(employeeId, PageRequest.of(page, size));
    }

    public String uploadCsv(MultipartFile file) throws InvalidFileFormatException, EmptyCsvFileException {
        StringBuilder resultSummary = new StringBuilder();  // For capturing summary of success/failure
        int successCount = 0;
        int failureCount = 0;

        try {
            if (!file.getOriginalFilename().endsWith(".csv")) {
                throw new InvalidFileFormatException("Invalid file format. Please upload a CSV file.");
            }

            CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()));
            String[] headers = csvReader.readNext();

            if (headers == null) {
                throw new EmptyCsvFileException("CSV file is empty.");
            }

            String[] nextLine;
            while ((nextLine = csvReader.readNext()) != null) {
                Map<String, String> row = new HashMap<>();
                for (int i = 0; i < headers.length; i++) {
                    row.put(headers[i], nextLine[i]);
                }

                try {
                    validateInvoiceRow(row);  // Validate the invoice row
                    saveInvoiceToDatabase(row);  // Save the invoice data to the database
                    successCount++;  // Increment on successful save
                } catch (MissingFieldException e) {
                    System.err.println("Validation failed for row: " + row + " - " + e.getMessage());
                    resultSummary.append("Validation failed for row: ").append(row).append("\n");
                    failureCount++;  // Increment on failure
                } catch (Exception e) {
                    System.err.println("Unexpected error for row: " + row + " - " + e.getMessage());
                    resultSummary.append("Unexpected error for row: ").append(row).append("\n");
                    failureCount++;  // Increment on failure
                }
            }
        } catch (InvalidFileFormatException | EmptyCsvFileException e) {
            throw e;  // Rethrow exceptions that indicate an issue with the file itself
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred while processing the file: " + e.getMessage());
        }

        // Add summary of results
        resultSummary.append("Processing completed: ").append(successCount).append(" rows processed successfully, ")
                .append(failureCount).append(" rows failed.");

        return resultSummary.toString();  // Return the summary message
    }

    private void validateInvoiceRow(Map<String, String> rowData) throws MissingFieldException {
        if (rowData.get("dueDate") == null ||
                rowData.get("periodStartDate") == null ||
                rowData.get("periodEndDate") == null ||
                rowData.get("tariff") == null ||
                rowData.get("unitsConsumed") == null ||
                rowData.get("customerId") == null ||
                rowData.get("employeeId") == null) {
            throw new MissingFieldException("Missing required fields in row: " + rowData);
        }
    }

    private void saveInvoiceToDatabase(Map<String, String> rowData) {
        InvoiceRequest invoiceRequest = new InvoiceRequest();

        invoiceRequest.setDueDate(LocalDateTime.parse(rowData.get("dueDate")));  // Parsing date string to LocalDateTime
        invoiceRequest.setPeriodStartDate(LocalDateTime.parse(rowData.get("periodStartDate")));
        invoiceRequest.setPeriodEndDate(LocalDateTime.parse(rowData.get("periodEndDate")));
        invoiceRequest.setTariff(Double.parseDouble(rowData.get("tariff")));  // Parsing String to Double
        invoiceRequest.setUnitsConsumed(Double.parseDouble(rowData.get("unitsConsumed")));
        invoiceRequest.setCustomerId(rowData.get("customerId"));
        invoiceRequest.setEmployeeId(rowData.get("employeeId"));

        // Save the invoice to the database
        saveInvoice(invoiceRequest);
    }

}
