package com.prathameshShubham.bharatBijliCorporation.repositories;

import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, String> {


    Page<Customer> findByIdContainingIgnoreCase(String search, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE LOWER(c.personalDetails.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(c.personalDetails.lastName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Customer> searchByCustomerName(String search, Pageable pageable);

    Page<Customer> findByPersonalDetailsLastNameContainingIgnoreCase(String search, Pageable pageable);

    Page<Customer> findByPersonalDetailsFirstNameContainingIgnoreCase(String search, Pageable pageable);
}
