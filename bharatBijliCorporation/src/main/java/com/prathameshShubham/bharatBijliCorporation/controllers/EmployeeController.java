package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.dto.CsvUploadResult;
import com.prathameshShubham.bharatBijliCorporation.dto.RecordPaymentRequest;
import com.prathameshShubham.bharatBijliCorporation.exceptions.EmptyCsvFileException;
import com.prathameshShubham.bharatBijliCorporation.exceptions.InvalidFileFormatException;
import com.prathameshShubham.bharatBijliCorporation.exceptions.UserNotFoundException;
import com.prathameshShubham.bharatBijliCorporation.models.*;
import com.prathameshShubham.bharatBijliCorporation.response.ApiResponse;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.EmployeeService;
import com.prathameshShubham.bharatBijliCorporation.services.InvoiceService;
import com.prathameshShubham.bharatBijliCorporation.services.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Employee> saveEmployee(@RequestBody PersonalDetails personalDetails) {
        return ResponseEntity.ok(employeeService.saveEmployee(personalDetails));
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<?> getEmployee(@PathVariable String employeeId) {
        Employee employee = employeeService.getEmployee(employeeId);
        ApiResponse<Employee> response = ApiResponse.success(employee, "Employee retrieved successfully", HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{employeeId}/username")
    public ResponseEntity<Map<String, String>> getEmployeeUsername(@PathVariable String employeeId) {
        String username = employeeService.getEmployeeUsername(employeeId);
        return ResponseEntity.ok(Map.of("username", username));
    }

    // Endpoint to save a csv file of customers
    @PostMapping("customers/bulk-csv-upload")
    public ResponseEntity<?> saveCustomers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "File is empty"));
        }

        CsvUploadResult result = customerService.uploadCsv(file);
        String message = "Succesfull entry : " + result.getSuccessCount() + ", failed " + result.getFailureCount();
        if(result.getSuccessCount() == 0)
            return  ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(new ApiResponse<>(true,  message, result.getErrorMessages(), HttpStatus.NOT_ACCEPTABLE.value()));

        return ResponseEntity.ok(ApiResponse.success(result.getErrorMessages(), message, 200));
    }

    @GetMapping("count/customers")
    public ResponseEntity<Long> getCountOfCustomers(){
        return ResponseEntity.ok(customerService.getCountOfCustomers());
    }

    @PutMapping("update/customer")
    public ResponseEntity<PersonalDetails> updatePersonalDetails(@RequestBody Customer updatedCustomerDetails) {
        PersonalDetails updatedPersonalDetails = customerService.updateCustomer(updatedCustomerDetails);
        return ResponseEntity.ok(updatedPersonalDetails);
    }

    @GetMapping("getAll/Customers")
    public ResponseEntity<?> getPaginatedCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "asc") String sortOrder,
            @RequestParam(required = false) String search) {
        Page<Customer> chunk = customerService.getPaginatedCustomer(page, size, sortField, sortOrder, search);

        if (chunk.isEmpty()) {
            throw new UserNotFoundException("Not found for respective search query");
        }

        return ResponseEntity.ok(chunk);
    }

    @PostMapping("/record-payment")
    public ResponseEntity<Transaction> recordPayment(@Valid @RequestBody RecordPaymentRequest request) throws Exception {
        // Fetch the customer
        var customer = customerService.getCustomer(request.getCustomerId());

        // Fetch the invoice
        var invoice = invoiceService.getInvoice(request.getInvoiceId());

        // Call the service to create the transaction
        Transaction savedTransaction = transactionService.savePaymentByCustomer(request, customer, invoice);

        return new ResponseEntity<>(savedTransaction, HttpStatus.CREATED);
    }

}
