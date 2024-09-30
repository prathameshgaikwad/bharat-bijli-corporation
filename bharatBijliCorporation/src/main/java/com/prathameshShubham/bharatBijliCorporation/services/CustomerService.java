package com.prathameshShubham.bharatBijliCorporation.services;

import com.opencsv.CSVReader;
import com.prathameshShubham.bharatBijliCorporation.enums.ServiceConnectionStatus;
import com.prathameshShubham.bharatBijliCorporation.exceptions.*;
import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.repositories.CustomerRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
        try {
            PersonalDetails savedPersonalDetails = personalDetailsService.savePersonalDetails(personalDetails);
            String customerId = generateCustomerId();

            Customer newCustomer  = new Customer();
            newCustomer.setId(customerId);
            newCustomer.setPersonalDetails(savedPersonalDetails);
            newCustomer.setServiceConnectionStatus(ServiceConnectionStatus.ACTIVE);

            return customerRepo.save(newCustomer);
        } catch (DataIntegrityViolationException exception) {
            throw new DataIntegrityViolationException(exception.getMessage());
        }
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

    public Customer getCustomer(String customerId)  throws UserNotFoundException {
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

    public String uploadCsv(MultipartFile file) throws InvalidFileFormatException, EmptyCsvFileException {
        StringBuilder resultSummary = new StringBuilder();  // For capturing summary of success/failure
        int successCount = 0;
        int failureCount = 0;

        try {
            if (!file.getOriginalFilename().endsWith(".csv")) {
                throw new InvalidFileFormatException("Invalid file format. Please upload a CSV file.");
            }

            CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()));
            String[] headers = csvReader.readNext();

            if (headers == null) {
                throw new EmptyCsvFileException("CSV file is empty.");
            }

            String[] nextLine;
            while ((nextLine = csvReader.readNext()) != null) {
                Map<String, String> row = new HashMap<>();
                for (int i = 0; i < headers.length; i++) {
                    row.put(headers[i], nextLine[i]);
                }

                try {
                    validateRow(row);
                    isDuplicate(row);
                    saveToDatabase(row);
                    successCount++;  // Increment on successful save
                } catch (MissingFieldException e) {
                    System.err.println("Validation failed for row: " + row + " - " + e.getMessage());
                    resultSummary.append("Validation failed for row: ").append(row).append("\n");
                    failureCount++;  // Increment on failure
                } catch (DuplicateEntryException e) {
                    System.err.println("Duplicate entry for row: " + row + " - " + e.getMessage());
                    resultSummary.append("Duplicate entry for row: ").append(row).append("\n");
                    failureCount++;  // Increment on failure
                } catch (Exception e) {
                    System.err.println("Unexpected error for row: " + row + " - " + e.getMessage());
                    resultSummary.append("Unexpected error for row: ").append(row).append("\n");
                    failureCount++;  // Increment on failure
                }
            }
        } catch (InvalidFileFormatException | EmptyCsvFileException e) {
            throw e;  // Rethrow exceptions that indicate an issue with the file itself
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred while processing the file: " + e.getMessage());
        }

        // Add summary of results
        resultSummary.append("Processing completed: ").append(successCount).append(" rows processed successfully, ")
                .append(failureCount).append(" rows failed.");

        return resultSummary.toString();  // Return the summary message
    }

    private void validateRow(Map<String, String> rowData) throws MissingFieldException {
        if (rowData.get("dateOfBirth") == null ||
                rowData.get("city") == null ||
                rowData.get("address") == null ||
                rowData.get("emailId") == null ||
                rowData.get("pincode") == null ||
                rowData.get("firstName") == null ||
                rowData.get("lastName") == null ||
                rowData.get("phoneNumber") == null ||
                rowData.get("state") == null) {
            throw new MissingFieldException("Missing required fields in row: " + rowData);
        }
    }

    private void isDuplicate(Map<String, String> rowData) throws DuplicateEntryException {
        String emailId = rowData.get("emailId");
        if(checkIfEmailExists(emailId))
            throw new DuplicateEntryException("Duplicate entry found for: " + emailId);
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

    private boolean checkIfEmailExists(String emailId) {
        return false; // Placeholder return statement
    }

}
