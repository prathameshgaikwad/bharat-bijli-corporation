package com.prathameshShubham.bharatBijliCorporation.services;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.prathameshShubham.bharatBijliCorporation.dto.*;
import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import com.prathameshShubham.bharatBijliCorporation.exceptions.*;
import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import com.prathameshShubham.bharatBijliCorporation.repositories.InvoiceRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

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
        System.out.println("---------------------------------- UPDATING INVOICE STATUS " +
                "-------------------------------------");
        System.out.println(invoice.getInvoiceStatus());
        return invoiceRepo.save(invoice);
    }

    // get a paginated list of the latest invoices belonging to a customer
    public Page<Invoice> getLatestInvoicesForCustomer(String customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Customer customer = customerService.getCustomer(customerId);
        return invoiceRepo.findByCustomerSortedByDueDate(customer, pageable);
    }

    public InvoicesByStatusResponse getInvoicesByStatus(String customerId, InvoiceStatus invoiceStatus, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Invoice> invoicesByStatus = invoiceRepo.findByCustomerIdAndInvoiceStatus(customerId, invoiceStatus,
                pageable);

        double invoiceAmountTotal = invoicesByStatus.getContent().stream()
                .mapToDouble(i -> i.getUnitsConsumed() * i.getTariff())
                .sum();

        Page<InvoiceDTO> invoiceDTOPage = convertToDTO(invoicesByStatus);

        return new InvoicesByStatusResponse(invoiceAmountTotal, invoiceStatus, invoiceDTOPage);
    }

    private Page<InvoiceDTO> convertToDTO(Page<Invoice> invoices) {
        List<InvoiceDTO> invoiceDTOs = invoices.getContent().stream()
                .map(invoice -> {
                    InvoiceDTO dto = new InvoiceDTO();
                    dto.setId(invoice.getId());
                    dto.setUnitsConsumed(invoice.getUnitsConsumed());
                    dto.setTariff(invoice.getTariff());
                    dto.setPeriodStartDate(invoice.getPeriodStartDate());
                    dto.setPeriodEndDate(invoice.getPeriodEndDate());
                    dto.setDueDate(invoice.getDueDate());
                    dto.setInvoiceStatus(invoice.getInvoiceStatus());
                    dto.setCreatedAt(invoice.getCreatedAt());
                    dto.setUpdatedAt(invoice.getUpdatedAt());
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(invoiceDTOs, invoices.getPageable(), invoices.getTotalElements());
    }

    public Page<Invoice> getInvoicesByEmployeeId(String employeeId, int page, int size) {
        return invoiceRepo.findByGeneratedByEmployeeId(employeeId, PageRequest.of(page, size));
    }

    public CsvUploadResult uploadCsv(MultipartFile file, String empId) {
        if (file.isEmpty()) {
            throw new EmptyCsvFileException("CSV is Empty");
        }

        if (!file.getOriginalFilename().endsWith(".csv")) {
            throw new InvalidFileFormatException("Invalid file format. Please upload a CSV file.");
        }

        StringBuilder resultSummary = new StringBuilder();
        int successCount = 0;
        int failureCount = 0;
        int totalCount = 0;
        List<String> errorMessages = new ArrayList<>();

        try {
            CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()));
            String[] headers = csvReader.readNext();
            if (headers == null) {
                throw new EmptyCsvFileException("CSV file is empty.");
            }

            String[] nextLine;
            while ((nextLine = csvReader.readNext()) != null) {

                totalCount++;
                Map<String, String> row = new HashMap<>();
                row.put("employeeId", empId);
                try{
                    for (int i = 0; i < headers.length; i++) {
                        row.put(headers[i], nextLine[i]);
                    }
                }catch (Exception e){
                    failureCount++;
                    errorMessages.add("Row " + totalCount + ": value not found");
                }

                try {
                    validateInvoiceRow(row);
                    checkDuplicateEntry(row);
                    saveInvoiceToDatabase(row);
                    successCount++;
                } catch (InvalidDataFormatException | DuplicateEntryException | MissingFieldException | InvalidFieldFormatException e) {
                    failureCount++;
                    errorMessages.add("Row " + totalCount + ": " + e.getMessage());
                }
            }
        }
        catch (IOException | CsvValidationException e) {
            throw new InvalidFileFormatException("Error reading CSV file");
        }

        if(totalCount == 0)
            throw new EmptyCsvFileException("No records found");

        resultSummary.append(String.format("Processing completed: %d rows processed successfully, %d rows failed.",
                successCount, failureCount));

        CsvUploadResult result = new CsvUploadResult(successCount, failureCount, errorMessages);

        return result;
    }

    private void checkDuplicateEntry(Map<String, String> rowData) throws DuplicateEntryException{
        LocalDateTime periodStartDate = LocalDateTime.parse(rowData.get("periodStartDate")+ "T00:00:00");
        LocalDateTime periodEndDate = LocalDateTime.parse(rowData.get("periodEndDate")+ "T00:00:00");
        String customerId = rowData.get("customerId");

        if(invoiceRepo.existsByCustomerIdAndPeriodStartDateAndPeriodEndDate(customerId, periodStartDate, periodEndDate)){
            throw new DuplicateEntryException("Duplicate entry found for: " + customerId + " " + periodStartDate + " - " + periodEndDate);
        }

    }

    private void validateInvoiceRow(Map<String, String> rowData) throws MissingFieldException, InvalidFieldFormatException {
        String dueDate = rowData.get("dueDate");
        String periodStartDate = rowData.get("periodStartDate");
        String periodEndDate = rowData.get("periodEndDate");
        String tariff = rowData.get("tariff");
        String unitsConsumed = rowData.get("unitsConsumed");
        String customerId = rowData.get("customerId");
        String employeeId = rowData.get("employeeId");

        // Check for missing fields
        if (dueDate == null || periodStartDate == null || periodEndDate == null ||
                tariff == null || unitsConsumed == null || customerId == null || employeeId == null) {
            throw new MissingFieldException("Missing required fields in row: " + rowData);
        }

        if (!dueDate.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
            throw new InvalidFieldFormatException("Invalid due date format in row: " + rowData);
        }
        if (!periodStartDate.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
            throw new InvalidFieldFormatException("Invalid period start date format in row: " + rowData);
        }
        if (!periodEndDate.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
            throw new InvalidFieldFormatException("Invalid period end date format in row: " + rowData);
        }

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try {
            // Parse the dates
            LocalDate dueDateParsed = LocalDate.parse(dueDate, dateFormatter);
            LocalDate periodStartDateParsed = LocalDate.parse(periodStartDate, dateFormatter);
            LocalDate periodEndDateParsed = LocalDate.parse(periodEndDate, dateFormatter);

            // Validate date relationships
            if (!periodEndDateParsed.isAfter(periodStartDateParsed)) {
                throw new InvalidFieldFormatException("Period end date must be after the period start date in row: " + rowData);
            }
            if (!dueDateParsed.isAfter(periodEndDateParsed)) {
                throw new InvalidFieldFormatException("Due date must be after the period end date in row: " + rowData);
            }

        } catch (DateTimeParseException e) {
            throw new InvalidFieldFormatException("Invalid date values in row: " + rowData + " - " + e.getMessage());
        }

        if (!tariff.matches("^\\d+(\\.\\d{1,2})?$")) { // allows for up to two decimal places
            throw new InvalidFieldFormatException("Invalid tariff format in row: " + rowData);
        }
        if (!unitsConsumed.matches("^\\d+(\\.\\d{1,2})?$")) { // allows for up to two decimal places
            throw new InvalidFieldFormatException("Invalid units consumed format in row: " + rowData);
        }

        if (!customerId.startsWith("CUST") && customerId.length() < 6) {
            throw new InvalidFieldFormatException("Invalid customer ID format in row: " + rowData);
        }
        if (!employeeId.startsWith("EMP") && employeeId.length()  < 6) {
            throw new InvalidFieldFormatException("Invalid employee ID format in row: " + rowData);
        }
    }

    private void saveInvoiceToDatabase(Map<String, String> rowData) {
        InvoiceRequest invoiceRequest = new InvoiceRequest();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        invoiceRequest.setDueDate(LocalDateTime.parse(rowData.get("dueDate")+ "T00:00:00"));  // Parsing date string to LocalDateTime
        invoiceRequest.setPeriodStartDate(LocalDateTime.parse(rowData.get("periodStartDate")+ "T00:00:00"));
        invoiceRequest.setPeriodEndDate(LocalDateTime.parse(rowData.get("periodEndDate") + "T00:00:00"));
        invoiceRequest.setTariff(Double.parseDouble(rowData.get("tariff")));  // Parsing String to Double
        invoiceRequest.setUnitsConsumed(Double.parseDouble(rowData.get("unitsConsumed")));
        invoiceRequest.setCustomerId(rowData.get("customerId"));
        invoiceRequest.setEmployeeId(rowData.get("employeeId"));

        // Save the invoice to the database
        saveInvoice(invoiceRequest);
    }

    public Long getCountOfInvoices() {
        return invoiceRepo.count();
    }

    public Page<Invoice> getPaginatedInvoices(int pageNo, int size, String sortField, String sortOrder, String search) {
        if ("customer".equals(sortField)) {
            sortField = "customer.personalDetails.firstName";
        }

        Sort sort = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sort);

        // Check if search is provided
        if (search != null && !search.isEmpty()) {
            Page<Invoice> page = invoiceRepo.findByCustomerId(search, pageable);
            if (page.isEmpty()) {
                String[] names = search.trim().split(" ");
                if (names.length == 2) {
                    String firstName = names[0];
                    String lastName = names[1];
                    page = invoiceRepo.searchByFullName(firstName, lastName, pageable);
                } else {
                    page = invoiceRepo.searchByCustomerName(search, pageable);
                }
            }
            return page;
        } else {
            return invoiceRepo.findAll(pageable);
        }
    }


    public List<MonthlyUsageDTO> getMonthlyUsageLastYear(String customerId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate = now.minusYears(1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endDate = now.withDayOfMonth(now.getDayOfMonth()).withHour(23).withMinute(59).withSecond(59).withNano(999999999);
        List<Invoice> invoices = invoiceRepo.findByCustomerIdAndPeriodStartDateBetween(customerId, startDate,
                endDate);

        Map<String, Double> monthlyUsageMap = new HashMap<>();

        for (Invoice invoice : invoices) {
            LocalDateTime periodStartDate = invoice.getPeriodStartDate();
            String monthYearKey = periodStartDate.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + periodStartDate.getYear();
            monthlyUsageMap.merge(monthYearKey, invoice.getUnitsConsumed(), Double::sum);
        }

        List<MonthlyUsageDTO> monthlyUsageList = new ArrayList<>();

        YearMonth startMonth = YearMonth.from(startDate);
        YearMonth endMonth = YearMonth.from(endDate);

        for (YearMonth targetMonth = startMonth; !targetMonth.isAfter(endMonth); targetMonth = targetMonth.plusMonths(1)) {
            String monthName = targetMonth.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            Double unitsConsumed = monthlyUsageMap.getOrDefault(monthName + " " + targetMonth.getYear(), 0.0);

            monthlyUsageList.add(new MonthlyUsageDTO(monthName, targetMonth.getYear(), unitsConsumed));
        }

        return monthlyUsageList;
    }
}
