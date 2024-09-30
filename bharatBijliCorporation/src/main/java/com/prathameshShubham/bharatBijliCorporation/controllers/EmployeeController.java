package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.exceptions.EmptyCsvFileException;
import com.prathameshShubham.bharatBijliCorporation.exceptions.InvalidFileFormatException;
import com.prathameshShubham.bharatBijliCorporation.models.Employee;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CustomerService customerService;

    @PostMapping
    public ResponseEntity<Employee> saveEmployee(@RequestBody PersonalDetails personalDetails) {
        return ResponseEntity.ok(employeeService.saveEmployee(personalDetails));
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<Employee> getEmployee(@PathVariable String employeeId) {
        return ResponseEntity.ok(employeeService.getEmployee(employeeId));
    }

    // Endpoint to save a csv file of customers
    @PostMapping("customers/bulk-csv-upload")
    public ResponseEntity<String> saveCustomers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
        }

        try {
            String result = customerService.uploadCsv(file);
            return ResponseEntity.status(HttpStatus.OK).body(result); // Return OK if processing was successful
        } catch (InvalidFileFormatException | EmptyCsvFileException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }  catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while processing the file: " + e.getMessage());
        }
    }

}
