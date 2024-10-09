package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.dto.CsvUploadResult;
import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import com.prathameshShubham.bharatBijliCorporation.exceptions.EmptyCsvFileException;
import com.prathameshShubham.bharatBijliCorporation.exceptions.InvalidFileFormatException;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import com.prathameshShubham.bharatBijliCorporation.dto.InvoiceRequest;
import com.prathameshShubham.bharatBijliCorporation.response.ApiResponse;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.InvoiceService;
import com.prathameshShubham.bharatBijliCorporation.services.PDFService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("invoices")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private PDFService pdfService;

    @GetMapping("/{invoiceId}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(invoiceService.getInvoice(invoiceId));
    }

    @PostMapping
    public ResponseEntity<Invoice> saveInvoice(@RequestBody @Valid InvoiceRequest invoiceRequest) {
        return ResponseEntity.ok(invoiceService.saveInvoice(invoiceRequest));
    }

    @PatchMapping("/{invoiceId}/status")
    public ResponseEntity<Invoice> updateInvoiceStatus(
            @PathVariable Long invoiceId,
            @RequestBody InvoiceStatus invoiceStatus
    ) {
        return ResponseEntity.ok(invoiceService.updateInvoiceStatus(invoiceId, invoiceStatus));
    }

    @GetMapping("/{invoiceId}/pdf")
    public ResponseEntity<byte[]> getInvoicePdf(@PathVariable Long invoiceId) throws IOException {
        Invoice invoice = invoiceService.getInvoice(invoiceId);
        byte[] pdfBytes = pdfService.generatePDF(invoice);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=invoice_" + invoiceId + ".pdf");
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice_" + invoiceId + ".pdf"); // Forces download
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.status(HttpStatus.OK)
                .headers(headers)
                .body(pdfBytes);
    }

    @GetMapping("employee/{employeeId}")
    public ResponseEntity<Page<Invoice>> getInvoicesByEmployeeId(
            @PathVariable String employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Invoice> invoices = invoiceService.getInvoicesByEmployeeId(employeeId, page, size);
        return ResponseEntity.ok(invoices);
    }

    @PostMapping("{employeeId}/bulk-csv-upload")
    public ResponseEntity<?> saveInvoices(@RequestParam("file") MultipartFile file,
                                               @PathVariable String employeeId) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("File is empty", HttpStatus.BAD_REQUEST.value()
            ));
        }

        CsvUploadResult result = invoiceService.uploadCsv(file, employeeId);
        String message = "Successful entry : " + result.getSuccessCount() + ", failed " + result.getFailureCount();
        if(result.getSuccessCount() == 0)
            return  ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(new ApiResponse<>(true,  message, result.getErrorMessages(), HttpStatus.NOT_ACCEPTABLE.value()));

        return ResponseEntity.ok(ApiResponse.success(result.getErrorMessages(), message, 200));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCountOfTransactions(){
        return ResponseEntity.ok(invoiceService.getCountOfInvoices());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Invoice>>> getInvoices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "customer.personalDetails.firstName") String sortField,
            @RequestParam(defaultValue = "asc") String sortOrder,
            @RequestParam(required = false) String search) {
        Page<Invoice> chunk = invoiceService.getPaginatedInvoices(page, size, sortField, sortOrder, search);

        if(chunk.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("No Invoice found...... !", 404));
        }

        return ResponseEntity.ok(ApiResponse.success(chunk, "Invoices Fetched Successfully.", 200));
    }

}
