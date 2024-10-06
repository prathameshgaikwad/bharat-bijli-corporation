package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.exceptions.InvalidIdFormatException;
import com.prathameshShubham.bharatBijliCorporation.exceptions.UserNotFoundException;
import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.Employee;
import com.prathameshShubham.bharatBijliCorporation.dto.LoginRequest;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import com.prathameshShubham.bharatBijliCorporation.services.EmployeeService;
import com.prathameshShubham.bharatBijliCorporation.jwt.JwtUtil;
import com.prathameshShubham.bharatBijliCorporation.services.OtpService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
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

import static com.prathameshShubham.bharatBijliCorporation.constants.SecurityConstants.*;

@RestController
@RequestMapping("auth")
public class AuthController {

    private String role;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private OtpService otpService;

    @GetMapping("/test")
    public ResponseEntity<String> getTest(){
        return ResponseEntity.ok("Testing Successful.");
    }

    @GetMapping(value = "/getOtp", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> getOtp(@RequestParam String id) {
        String email;
        String generatedOtp = otpService.generateOtp(id);
        try {
            email = getEmailById(id);
        } catch (UserNotFoundException | InvalidIdFormatException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));  // Return error message
        }

        //TODO: sendEmail(email, generatedOtp);
        return ResponseEntity.ok(
                Map.of(
                        "message", "OTP sent to email: " + email,
                        "otp", generatedOtp
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody @Valid LoginRequest loginRequest,
                                                     HttpServletResponse httpServletResponse) {
        boolean isValidOtp = otpService.validateOtp(loginRequest.getUserId(), loginRequest.getOtp());
        if (!isValidOtp) {
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

        otpService.invalidateOtp(loginRequest.getUserId());

        String token = JwtUtil.generateToken(loginRequest.getUserId(), role);
        String refreshToken = JwtUtil.generateRefreshToken(loginRequest.getUserId());
        return sendResponseWithCookies(token, refreshToken, httpServletResponse, loginRequest.getUserId());
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        try {
            Cookie[] cookies = request.getCookies();
            String jwtToken = JwtUtil.extractTokenFromCookies(cookies, JWT_COOKIE_NAME);

            if (jwtToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token found");
            }

            Claims claims = JwtUtil.extractClaims(jwtToken);
            String userId = claims.getSubject();

            if (JwtUtil.validateToken(jwtToken, userId)) {
                String role = JwtUtil.extractRole(jwtToken);
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("userId", userId);
                response.put("role", role);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token has expired");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error validating token");
        }
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = JwtUtil.extractTokenFromCookies(request.getCookies(), REFRESH_TOKEN_COOKIE_NAME);

        if (JwtUtil.validateToken(refreshToken, JwtUtil.extractClaims(refreshToken).getSubject())) {
            String userId = JwtUtil.extractClaims(refreshToken).getSubject();
            String newAccessToken = JwtUtil.generateToken(userId, role);
            Cookie newJwtCookie = JwtUtil.getHttpOnlyJwtCookie(newAccessToken);
            response.addCookie(newJwtCookie);
            return ResponseEntity.ok(Map.of("message", "Token refreshed successfully!"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
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
        Cookie invalidatedJwtCookie = JwtUtil.getInvalidatedJwtCookie();
        Cookie invalidatedRefreshTokenCookie = JwtUtil.getInvalidatedRefreshTokenCookie();
        httpServletResponse.addCookie(invalidatedJwtCookie);
        httpServletResponse.addCookie(invalidatedRefreshTokenCookie);
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

    private ResponseEntity<Map<String, String>> sendResponseWithCookies(
            String token,
            String refreshToken,
            HttpServletResponse httpServletResponse,
            String userId
    ) {
        Cookie jwtCookie = JwtUtil.getHttpOnlyJwtCookie(token);
        Cookie refreshCookie = JwtUtil.getHttpOnlyRefreshCookie(refreshToken);

        httpServletResponse.addCookie(refreshCookie);
        httpServletResponse.addCookie(jwtCookie);
        return ResponseEntity.ok(
                Map.of(
                        "message","Login successful",
                        "role",role,
                        "userId",userId
                )
        );
    }

}
