package com.prathameshShubham.bharatBijliCorporation.repositories;

import com.prathameshShubham.bharatBijliCorporation.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepo  extends JpaRepository<Employee, String> {
}
