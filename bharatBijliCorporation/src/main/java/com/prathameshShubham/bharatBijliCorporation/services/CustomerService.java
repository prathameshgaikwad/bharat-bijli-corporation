package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.repositories.CustomerRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private PersonalDetailsService personalDetailsService;

    public Customer saveCustomer(Customer customer, PersonalDetails personalDetails) {
        PersonalDetails savedPersonalDetails = personalDetailsService.savePersonalDetails(personalDetails);
        customer.setPersonalDetails(savedPersonalDetails);
        return customerRepo.save(customer);
    }

    public Customer getCustomer(Long customerId) {
        return customerRepo
                .findById(customerId)
                .orElseThrow(
                        () -> new EntityNotFoundException("Customer not found for ID: " + customerId)
                );
    }
}
