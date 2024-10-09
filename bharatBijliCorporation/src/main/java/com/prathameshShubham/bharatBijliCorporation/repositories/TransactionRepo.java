package com.prathameshShubham.bharatBijliCorporation.repositories;

import com.prathameshShubham.bharatBijliCorporation.enums.TransactionStatus;
import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import com.prathameshShubham.bharatBijliCorporation.models.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Long> {
    @Query("SELECT t FROM Transaction t WHERE t.customer = :customer ORDER BY t.transactionDate DESC")
    Page<Transaction> findByCustomerOrderByTransactionDateDesc(Customer customer, Pageable pageable);

    Page<Transaction> findByOrderByCreatedAtDesc(Pageable pageable);

    Long countByTransactionStatus(TransactionStatus transactionStatus);

    Page<Transaction>findByCustomerIdContainingIgnoreCase(String search, Pageable page);

    Page<Transaction> findByCustomerIdContainingIgnoreCaseOrCustomerPersonalDetailsEmailIdContainingIgnoreCase(String search1, String search2, Pageable page);

    @Query("SELECT t FROM Transaction t JOIN t.customer c JOIN c.personalDetails p " +
            "WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Transaction> searchByCustomerName(String search, Pageable pageable);

//    Page<Transaction> findByCustomerPersonalDetailsFirstNameContainingIgnoreCaseAndCustomerPersonalDetailsLastNameContainingIgnoreCase(String firstName, String lastName, Pageable pageable);

    Transaction findByInvoiceIdAndTransactionStatus(Long invoiceId, TransactionStatus transactionStatus);

    Page<Transaction> findByCustomerId(String customerId, Pageable pageable);

    @Query("SELECT t FROM Transaction t JOIN t.customer c JOIN c.personalDetails p " +
            "WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')) " +
            "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))")
    Page<Transaction> searchByFullName(String firstName, String lastName, Pageable pageable);
}
