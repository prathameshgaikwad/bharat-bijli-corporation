package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.CustomerRequest;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping
    public ResponseEntity<Customer> saveCustomer(@RequestBody CustomerRequest customerRequest) {
        PersonalDetails personalDetails = customerRequest.getPersonalDetails();
        Customer customer = customerRequest.getCustomer();

        return ResponseEntity.ok(customerService.saveCustomer(customer, personalDetails));
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Long customerId){
        return ResponseEntity.ok(customerService.getCustomer(customerId));
    }
}
