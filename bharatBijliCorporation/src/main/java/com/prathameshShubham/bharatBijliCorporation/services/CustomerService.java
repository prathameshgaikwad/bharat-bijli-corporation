package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.enums.ServiceConnectionStatus;
import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.repositories.CustomerRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private PersonalDetailsService personalDetailsService;

    public Customer saveCustomer(PersonalDetails personalDetails) {
        PersonalDetails savedPersonalDetails = personalDetailsService.savePersonalDetails(personalDetails);
        String customerId = generateCustomerId();

        Customer newCustomer  = new Customer();
        newCustomer.setId(customerId);
        newCustomer.setPersonalDetails(savedPersonalDetails);
        newCustomer.setServiceConnectionStatus(ServiceConnectionStatus.ACTIVE);

        return customerRepo.save(newCustomer);
    }

    // Service to save a batch of customers
    public List<Customer> saveCustomers(List<PersonalDetails> personalDetailsList) {
        List<Customer> customers = new ArrayList<>();

        for(PersonalDetails individualPersonalDetails: personalDetailsList) {
            Customer savedCustomer = saveCustomer(individualPersonalDetails);
            customers.add(savedCustomer);
        }
        return customers;
    }

    public Customer getCustomer(String customerId) {
        return customerRepo
                .findById(customerId)
                .orElseThrow(
                        () -> new EntityNotFoundException("Customer not found for ID: " + customerId)
                );
    }

    private String generateCustomerId() {
        long count = customerRepo.count() + 1; // Get the count of employees and increment
        return String.format("CUST%010d", count);
    }
}
