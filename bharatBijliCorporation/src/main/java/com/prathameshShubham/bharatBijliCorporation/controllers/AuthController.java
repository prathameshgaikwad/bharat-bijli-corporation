package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.Employee;
import com.prathameshShubham.bharatBijliCorporation.models.LoginRequest;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.EmployeeService;
import com.prathameshShubham.bharatBijliCorporation.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

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
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender javaMailSender;

    @GetMapping("/test")
    public ResponseEntity<String> getTest(){
        return ResponseEntity.ok("Testing Successful.");
    }

    @GetMapping("/getOtp")
    public ResponseEntity<String> getOtp(@RequestBody String id) {
        String email;

        try {
            email = getEmailById(id);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());  // Return error message
        }
        
        generatedOtp = String.valueOf((int) ((Math.random() * 900000) + 100000));  // Random 6-digit OTP
//        sendEmail(email, generatedOtp);
        return ResponseEntity.ok("OTP sent to email: " + email + " " + generatedOtp);
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
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        // Verify the OTP
        if (!loginRequest.getOtp().equals(generatedOtp)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OTP");
        }

        // Retrieve the user (Employee or Customer)
        Object user = getUserById(loginRequest.getUserId());

        // Check if the user exists
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User ID does not exist");
        }


        // Generate a JWT token for the user with role
        String token = jwtUtil.generateToken(loginRequest.getUserId(), role);

        // Return the JWT token in the response
        return ResponseEntity.ok(token);
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
