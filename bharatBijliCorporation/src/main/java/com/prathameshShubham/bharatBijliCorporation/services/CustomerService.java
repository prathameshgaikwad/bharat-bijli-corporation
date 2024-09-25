package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.enums.ServiceConnectionStatus;
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

    public Customer saveCustomer(PersonalDetails personalDetails) {
        PersonalDetails savedPersonalDetails = personalDetailsService.savePersonalDetails(personalDetails);
        String custId = generateCustId();

        Customer cust  = new Customer();
        cust.setId(custId);
        cust.setPersonalDetails(savedPersonalDetails);
        cust.setServiceConnectionStatus(ServiceConnectionStatus.ACTIVE);

        return customerRepo.save(cust);
    }

    private String generateCustId() {
        long count = customerRepo.count() + 1; // Get the count of employees and increment
        return String.format("CUST%06d", count);
    }

    public Customer getCustomer(String customerId) {
        return customerRepo
                .findById(customerId)
                .orElseThrow(
                        () -> new EntityNotFoundException("Customer not found for ID: " + customerId)
                );
    }
}
