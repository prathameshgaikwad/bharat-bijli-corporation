package com.prathameshShubham.bharatBijliCorporation.repositories;

import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import java.time.LocalDateTime;


@Repository
public interface InvoiceRepo extends JpaRepository<Invoice, Long> {

    @Query("SELECT i FROM Invoice i WHERE i.customer = :customer ORDER BY i.dueDate DESC")
    Page<Invoice> findByCustomerSortedByDueDate(Customer customer, Pageable pageable);
    Page<Invoice> findByGeneratedByEmployeeId(String employeeId, Pageable pageable);
    Page<Invoice> findByCustomerIdAndInvoiceStatus(String customerId, InvoiceStatus status, Pageable pageable);
    List<Invoice> findByCustomerIdAndPeriodStartDateBetween(String customerId, LocalDateTime startDate,
                                                             LocalDateTime endDate);

    @Query("SELECT i FROM Invoice i JOIN i.customer c JOIN c.personalDetails p " +
            "WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Invoice> searchByCustomerName(String search, Pageable pageable);

    Page<Invoice> findByCustomerId(String customerId, Pageable pageable);

    boolean existsByCustomerIdAndPeriodStartDateAndPeriodEndDate(String customerId, LocalDateTime periodStartDate, LocalDateTime periodEndDate);
}
