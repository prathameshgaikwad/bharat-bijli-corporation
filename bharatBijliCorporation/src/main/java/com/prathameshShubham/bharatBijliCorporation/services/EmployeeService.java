package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.enums.EmployeeStatus;
import com.prathameshShubham.bharatBijliCorporation.exceptions.UserNotFoundException;
import com.prathameshShubham.bharatBijliCorporation.models.Employee;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import com.prathameshShubham.bharatBijliCorporation.repositories.EmployeeRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private PersonalDetailsService personalDetailsService;

    public Employee saveEmployee(PersonalDetails personalDetails) {
        PersonalDetails savedPersonalDetails = personalDetailsService.savePersonalDetails(personalDetails);
        String empId = generateEmployeeId();

        // Create a new Employee
        Employee newEmployee = new Employee();
        newEmployee.setId(empId);
        newEmployee.setPersonalDetails(savedPersonalDetails);
        newEmployee.setEmployeeStatus(EmployeeStatus.ACTIVE);

        // Save the new Employee to the database
        return employeeRepo.save(newEmployee);
    }

    private String generateEmployeeId() {
        long count = employeeRepo.count() + 1; // Get the count of employees and increment
        return String.format("EMP%06d", count);  // Format ID with leading zeros
    }

    public Employee getEmployee(String employeeId) throws UserNotFoundException {
        return employeeRepo.findById(employeeId)
                .orElseThrow(
                        () -> new EntityNotFoundException("Employee not found for ID: " + employeeId)
                );
    }
}
