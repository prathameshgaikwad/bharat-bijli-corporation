package com.prathameshShubham.bharatBijliCorporation.services;

import com.opencsv.CSVReader;
import com.prathameshShubham.bharatBijliCorporation.enums.ServiceConnectionStatus;
import com.prathameshShubham.bharatBijliCorporation.exceptions.InvalidFileFormatException;
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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public String uploadCsv(MultipartFile file) throws Exception {
        if (!file.getOriginalFilename().endsWith(".csv")) {
            throw new InvalidFileFormatException("Invalid file format. Please upload a CSV file.");
        }
        CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()));

        // Read the header row
        String[] headers = csvReader.readNext();
        if (headers == null) {
            throw new Exception("CSV file is empty.");
        }

        // Dynamically map column names to values using a list of maps
        String[] nextLine;
        while ((nextLine = csvReader.readNext()) != null) {
            Map<String, String> row = new HashMap<>();
            for (int i = 0; i < headers.length; i++) {
                row.put(headers[i], nextLine[i]);
            }

            saveToDatabase(row);
        }
        return "File uploaded and processed successfully.";
    }


    private void saveToDatabase(Map<String, String> rowData) {
        PersonalDetails personalDetails = new PersonalDetails();

        personalDetails.setDateOfBirth(LocalDate.parse(rowData.get("dateOfBirth")));
        personalDetails.setCity(rowData.get("city"));
        personalDetails.setAddress(rowData.get("address"));
        personalDetails.setEmailId(rowData.get("emailId"));
        personalDetails.setPincode(Integer.parseInt(rowData.get("pincode")));
        personalDetails.setFirstName(rowData.get("firstName"));
        personalDetails.setLastName(rowData.get("lastName"));
        personalDetails.setPhoneNumber(rowData.get("phoneNumber"));
        personalDetails.setState(rowData.get("state"));

        saveCustomer(personalDetails);
    }
}
