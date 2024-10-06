package com.prathameshShubham.bharatBijliCorporation.services;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.prathameshShubham.bharatBijliCorporation.dto.CsvUploadResult;
import com.prathameshShubham.bharatBijliCorporation.enums.ServiceConnectionStatus;
import com.prathameshShubham.bharatBijliCorporation.exceptions.*;
import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.repositories.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

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
                        () -> new UserNotFoundException("Customer not found for ID: " + customerId)
                );
    }

    public String getCustomerUsername(String customerId)  throws UserNotFoundException {
        return customerRepo
                .findById(customerId)
                .map(customer -> customer.getPersonalDetails().getFirstName())
                .orElseThrow(
                        () -> new UserNotFoundException("Customer not found for ID: " + customerId)
                );
    }

    private String generateCustomerId() {
        long count = customerRepo.count() + 1; // Get the count of employees and increment
        return String.format("CUST%06d", count);
    }

    public CsvUploadResult uploadCsv(MultipartFile file) {
        if (!file.getOriginalFilename().endsWith(".csv")) {
            throw new InvalidFileFormatException("Invalid file format. Please upload a CSV file.");
        }

        StringBuilder resultSummary = new StringBuilder();
        int successCount = 0;
        int failureCount = 0;
        int totalCount = 0;
        List<String> errorMessages = new ArrayList<>();

        try {
            CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()));
            String[] headers = csvReader.readNext();
            if (headers == null) {
                throw new EmptyCsvFileException("CSV file is empty.");
            }

            String[] nextLine;
            while ((nextLine = csvReader.readNext()) != null) {

                totalCount++;
                Map<String, String> row = new HashMap<>();
                try{
                    for (int i = 0; i < headers.length; i++) {
                        row.put(headers[i], nextLine[i]);
                    }
                }catch (Exception e){
                    failureCount++;
                    errorMessages.add("Row " + totalCount + ": value not found");
                }

                try {
                    validateRow(row);
                    isDuplicate(row);
                    saveToDatabase(row);
                    successCount++;
                } catch (MissingFieldException e) {
                    failureCount++;
                    errorMessages.add("Row " + totalCount + ": " + e.getMessage());
                } catch (DuplicateEntryException e) {
                    failureCount++;
                    errorMessages.add("Row " + totalCount + ": " + e.getMessage());
                }
            }
        } catch (IOException | CsvValidationException e) {
            throw new InvalidFileFormatException("Error reading CSV file");
        }

        if (totalCount == 0) {
            throw new EmptyCsvFileException("No records found");
        }
        CsvUploadResult result = new CsvUploadResult(successCount, failureCount, errorMessages);
        return result;
    }


    private void validateRow(Map<String, String> rowData) throws MissingFieldException {
        String firstName = rowData.get("firstName");
        String lastName = rowData.get("lastName");
        String emailId = rowData.get("emailId");
        String phoneNumber = rowData.get("phoneNumber");
        String address = rowData.get("address");
        String city = rowData.get("city");
        String pincode = rowData.get("pincode");
        String dateOfBirth = rowData.get("dateOfBirth");
        String state = rowData.get("state");

        // Check for missing fields
        if (firstName == null || lastName == null || emailId == null || phoneNumber == null ||
                address == null || city == null || pincode == null || dateOfBirth == null || state == null) {
            throw new MissingFieldException("Missing required fields in row: " + rowData);
        }

        // Validate first and last name (non-empty and alphabetical)
        if (!firstName.matches("[A-Za-z]+") || !lastName.matches("[A-Za-z]+")) {
            throw new MissingFieldException("Invalid name format in row: " + rowData);
        }

        // Validate email format
        if (!emailId.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            throw new MissingFieldException("Invalid email format in row: " + rowData);
        }

        // Validate phone number format (Indian 10-digit phone number)
        if (!phoneNumber.matches("^\\d{10}$")) {
            throw new MissingFieldException("Invalid phone number format in row: " + rowData);
        }

        // Validate pincode format (Indian 6-digit pincode)
        if (!pincode.matches("^\\d{6}$")) {
            throw new MissingFieldException("Invalid pincode format in row: " + rowData);
        }

        // Validate date of birth format (YYYY-MM-DD format assumed here)
        if (!dateOfBirth.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
            throw new MissingFieldException("Invalid date of birth format in row: " + rowData);
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
        return personalDetailsService.checkIfEmailExists(emailId); // Placeholder return statement
    }

    public Long getCountOfCustomers() {
        return customerRepo.count();
    }

    public Page<Customer> getPaginatedCustomer(int pageNo, int size, String sortField, String sortOrder, String search) {

        Sort sort = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sort);

        // Check if search is provided
        if (search != null && !search.isEmpty()) {
            // Try to find by Customer ID first
            Page<Customer> page = customerRepo.findByIdContainingIgnoreCase(search, pageable);
            if (page.isEmpty()) {
                // If no result by customer ID, check for full name or partial name match
                String[] names = search.trim().split(" ");
                if (names.length == 2) {
                    String firstName = names[0];
                    String lastName = names[1];
                    page = customerRepo.searchByFullName(firstName, lastName, pageable);
                } else {
                    page = customerRepo.searchByCustomerName(search, pageable);
                }
            }
            return page;
        } else {
            // If no search, return all paginated customers
            return customerRepo.findAll(pageable);
        }
    }

    public PersonalDetails updateCustomer(Customer updatedCustomerDetails) {
        Optional<Customer> customerOptional = customerRepo.findById(updatedCustomerDetails.getId());

        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            PersonalDetails personalDetails = customer.getPersonalDetails();
            return personalDetailsService.updatePersonalDetails(personalDetails, updatedCustomerDetails.getPersonalDetails());
        } else {
            throw new IllegalArgumentException("Customer not found with ID: " + updatedCustomerDetails.getId());
        }
    }

    public BigDecimal getWalletBalance(String customerId) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new UserNotFoundException("Customer not found with ID: " + customerId));
        return customer.getWalletBalance();
    }

    public void updateBalance(String customerId, BigDecimal transactionAmount) throws Exception {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new UserNotFoundException("Customer not found with ID:" + customerId));

        BigDecimal currentBalance = customer.getWalletBalance();
        BigDecimal newBalance = currentBalance.subtract(transactionAmount);

        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new InsufficientFundsException();
        }

        customer.setWalletBalance(newBalance);
        customerRepo.save(customer);

    }
}
