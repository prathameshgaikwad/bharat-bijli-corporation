package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.exceptions.InvalidIdFormatException;
import com.prathameshShubham.bharatBijliCorporation.exceptions.UserNotFoundException;
import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.Employee;
import com.prathameshShubham.bharatBijliCorporation.models.LoginRequest;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.EmployeeService;
import com.prathameshShubham.bharatBijliCorporation.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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

    private HashMap<String, String>storeOtp = new HashMap<String, String>();;
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
        String generatedOtp;
        try {
            email = getEmailById(id);
        } catch (UserNotFoundException | InvalidIdFormatException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));  // Return error message
        }

        generatedOtp = String.valueOf((int) ((Math.random() * 900000) + 100000));  // Random 6-digit OTP
        // sendEmail(email, generatedOtp);
        storeOtp.put(id, generatedOtp);
        return ResponseEntity.ok(
                Map.of(
                        "message", "OTP sent to email: " + email,
                        "otp", generatedOtp
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest, HttpServletResponse httpServletResponse) {

        // Verify the OTP
        if (!loginRequest.getOtp().equals(storeOtp.get(loginRequest.getUserId()))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("message", "Invalid OTP")
            );
        }

        // Retrieve the user (Employee or Customer)
        Object user = getUserById(loginRequest.getUserId());

        // Check if the user exists
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("message", "User ID does not exist")
            );
        }

        // Generate a JWT token for the user with role
        String token = JwtUtil.generateToken(loginRequest.getUserId(), role);
//        return sendResponseWithHttpOnlyJwtCookie(token, httpServletResponse);
        return sendResponseWithJwt(token, httpServletResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody PersonalDetails personalDetails) {
        try {
            Customer newCustomer = customerService.saveCustomer(personalDetails);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("customer",newCustomer));
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of(
                            "message",
                            "Please use another Email Id"
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of(
                            "message",
                            e.getMessage()
                    )
            );
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse httpServletResponse) {
        Cookie invalidatedJwtCookie = getInvalidatedJwtCookie();
        httpServletResponse.addCookie(invalidatedJwtCookie);

        return ResponseEntity.ok(Map.of(
                "message", "Logout successful"
        ));
    }

    private void sendEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP is: " + otp);
        javaMailSender.send(message);
    }

    private String getEmailById(String id)  {
        if (id.startsWith("EMP") && id.length()>=9) {
            return getEmployeeEmailId(id);
        } else if (id.startsWith("CUST")  && id.length()>=9) {
            return getCustomerEmailId(id);
        } else {
            throw new InvalidIdFormatException("Invalid ID format: " + id);
        }
    }

    // Helper method to retrieve user (Employee or Customer) and set role
    private Object getUserById(String id) {
        if (id.startsWith("EMP"))
            return getUserWithEmployeeRole(id);
        else if (id.startsWith("CUST"))
            return getUserWithCustomerRole(id);
        else
            throw new IllegalArgumentException("Invalid User ID");
    }

    private Cookie getHttpOnlyJwtCookie(String token) {
        Cookie jwtCookie = new Cookie("jwt",token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");          // make accessible across entire app
        jwtCookie.setMaxAge(60*60);      // 1 hour expiry
        return jwtCookie;
    }

    private Cookie getInvalidatedJwtCookie() {
        Cookie jwtCookie = new Cookie("jwt", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");         // Ensure cookie is for entire app
        jwtCookie.setMaxAge(0);         // Set max age to 0 to delete the cookie
        return jwtCookie;
    }

    private Employee getUserWithEmployeeRole(String id) {
        Employee employee = employeeService.getEmployee(id);
        if (employee != null) {
            role = "EMPLOYEE";
            return employee;
        } else {
            throw new IllegalArgumentException("Invalid User ID");
        }
    }

    private Customer getUserWithCustomerRole(String id) {
        Customer customer = customerService.getCustomer(id);
        if (customer != null) {
            role = "CUSTOMER";
            return customer;
        }else {
            throw new IllegalArgumentException("Invalid User ID");
        }
    }

    private String getEmployeeEmailId(String id) throws UserNotFoundException {
        Employee employee = employeeService.getEmployee(id);
        if (employee == null || employee.getPersonalDetails() == null) {
            throw new UserNotFoundException("Employee not found for ID: " + id);
        }
        return employee.getPersonalDetails().getEmailId();
    }

    private String getCustomerEmailId(String id) throws  UserNotFoundException {
        Customer customer = customerService.getCustomer(id);
        if (customer == null || customer.getPersonalDetails() == null) {
            throw new UserNotFoundException("Customer not found for ID: " + id);
        }
        return customer.getPersonalDetails().getEmailId();
    }

    private ResponseEntity<Map<String, String>> sendResponseWithHttpOnlyJwtCookie(
            String token,
            HttpServletResponse httpServletResponse
    ) {
        Cookie jwtCookie = getHttpOnlyJwtCookie(token);
        httpServletResponse.addCookie(jwtCookie);
        storeOtp.clear();
        return ResponseEntity.ok(
                Map.of(
                        "message","Login successful",
                        "role",role
                )
        );
    }

    private ResponseEntity<Map<String, String>> sendResponseWithJwt(
            String token,
            HttpServletResponse httpServletResponse
    ) {
        return ResponseEntity.ok(
                Map.of(
                        "message","Login successful",
                        "token",token
                )
        );
    }
}
