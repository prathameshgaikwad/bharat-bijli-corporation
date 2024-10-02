package com.prathameshShubham.bharatBijliCorporation.repositories;

import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface InvoiceRepo extends JpaRepository<Invoice, Long> {

    Page<Invoice> findByCustomerOrderByCreatedAt(Customer customer, Pageable pageable);
    Page<Invoice> findByGeneratedByEmployeeId(String employeeId, Pageable pageable);
    Page<Invoice> findByCustomerIdAndInvoiceStatus(String customerId, InvoiceStatus status, Pageable pageable);
}
