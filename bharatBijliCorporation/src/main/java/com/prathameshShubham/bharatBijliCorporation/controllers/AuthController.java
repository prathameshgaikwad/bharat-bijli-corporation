package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.Employee;
import com.prathameshShubham.bharatBijliCorporation.models.LoginRequest;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.EmployeeService;
import com.prathameshShubham.bharatBijliCorporation.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("auth")
public class AuthController {

    private String generatedOtp;
    private String role;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private JavaMailSender javaMailSender;

    @GetMapping("/test")
    public ResponseEntity<String> getTest(){
        return ResponseEntity.ok("Testing Successful.");
    }

    @GetMapping(value = "/getOtp", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> getOtp(@RequestParam String id) {
        String email;

        try {
            email = getEmailById(id);
        } catch (IllegalArgumentException e) {
            Map<String, String> JSONErrorResponse = new HashMap<>();
            JSONErrorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(JSONErrorResponse);  // Return error message
        }
        
        generatedOtp = String.valueOf((int) ((Math.random() * 900000) + 100000));  // Random 6-digit OTP
//        sendEmail(email, generatedOtp);
        Map<String, String> JSONResponse = new HashMap<>();
        JSONResponse.put("message", "OTP sent to email: " + email);
        JSONResponse.put("otp", generatedOtp);
        return ResponseEntity.ok(JSONResponse);
    }

    private void sendEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP is: " + otp);
        javaMailSender.send(message);
    }

    private String getEmailById(String id) {
        if (id.startsWith("EMP")) {
            Employee employee = employeeService.getEmployee(id);
            if (employee == null || employee.getPersonalDetails() == null) {
                throw new IllegalArgumentException("Employee not found or invalid personal details");
            }
            return employee.getPersonalDetails().getEmailId();

        } else if (id.startsWith("CUST")) {
            Customer customer = customerService.getCustomer(id);
            if (customer == null || customer.getPersonalDetails() == null) {
                throw new IllegalArgumentException("Customer not found or invalid personal details");
            }
            return customer.getPersonalDetails().getEmailId();

        } else {
            throw new IllegalArgumentException("Invalid User ID");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {

        // Verify the OTP
        if (!loginRequest.getOtp().equals(generatedOtp)) {
            Map<String, String> JSONErrorResponse = new HashMap<>();
            JSONErrorResponse.put("message", "Invalid OTP");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(JSONErrorResponse);
        }

        // Retrieve the user (Employee or Customer)
        Object user = getUserById(loginRequest.getUserId());

        // Check if the user exists
        if (user == null) {
            Map<String, String> JSONErrorResponse = new HashMap<>();
            JSONErrorResponse.put("message", "User ID does not exist");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(JSONErrorResponse);
        }

        // Generate a JWT token for the user with role
        String token = JwtUtil.generateToken(loginRequest.getUserId(), role);

        // Return the JWT token in the response
        Map<String, String> JSONLoginResponse = new HashMap<>();
        JSONLoginResponse.put("token", token);
        return ResponseEntity.ok(JSONLoginResponse);
    }

    // Helper method to retrieve user (Employee or Customer) and set role
    private Object getUserById(String id) {
        if (id.startsWith("EMP")) {
            Employee employee = employeeService.getEmployee(id);
            if (employee != null) {
                role = "EMPLOYEE"; // Set role
                return employee;
            }
        } else if (id.startsWith("CUST")) {
            Customer customer = customerService.getCustomer(id);
            if (customer != null) {
                role = "CUSTOMER"; // Set role
                return customer;
            }
        } else {
            throw new IllegalArgumentException("Invalid User ID");
        }
        return null; // Return null if user not found
    }


}
