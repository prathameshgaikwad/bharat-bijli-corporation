package com.prathameshShubham.bharatBijliCorporation.services;

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

    public Employee saveEmployee(Employee employee, PersonalDetails personalDetails) {
        PersonalDetails savedPersonalDetails = personalDetailsService.savePersonalDetails(personalDetails);
        employee.setPersonalDetails(personalDetails);
        return employeeRepo.save(employee);
    }

    public Employee getEmployee(Long employeeId) {
        return employeeRepo
                .findById(employeeId)
                .orElseThrow(
                        () -> new EntityNotFoundException("Employee not found for ID: " + employeeId)
                );
    }
}
