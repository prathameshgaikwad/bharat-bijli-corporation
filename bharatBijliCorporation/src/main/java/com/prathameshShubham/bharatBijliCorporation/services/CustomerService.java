package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.enums.ServiceConnectionStatus;
import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.repositories.CustomerRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
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
        return String.format("CUST%06d", count);
    }

    public List<PersonalDetails> parseCsvToCustomers(MultipartFile file) throws IOException {
        List<PersonalDetails> personalDetailsList = new ArrayList<>();

        try(BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            reader.readLine();

            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");
                String firstName = data[0];
                String lastName = data[1];
                String emailId = data[2];
                String phoneNumber = data[3];
                String address = data[4];
                String city = data[5];
                String pincode = data[6];
                String state = data[7];
                String dateOfBirth = data[8];

                PersonalDetails personalDetails = new PersonalDetails();
                personalDetails.setFirstName(firstName);
                personalDetails.setLastName(lastName);
                personalDetails.setEmailId(emailId);
                personalDetails.setPhoneNumber(phoneNumber);
                personalDetails.setAddress(address);
                personalDetails.setCity(city);
                personalDetails.setPincode(Integer.valueOf(pincode));
                personalDetails.setState(state);
                personalDetails.setState(dateOfBirth);

                personalDetailsList.add(personalDetails);
            }
        }
        return personalDetailsList;
    }
}
