package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.enums.TransactionMethod;
import com.prathameshShubham.bharatBijliCorporation.enums.TransactionStatus;
import com.prathameshShubham.bharatBijliCorporation.models.Customer;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import com.prathameshShubham.bharatBijliCorporation.models.Transaction;
import com.prathameshShubham.bharatBijliCorporation.repositories.TransactionRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ProblemDetail;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private CustomerService customerService;

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepo.save(transaction);
    }

    public Transaction getTransaction(Long transactionId) {
        return transactionRepo
                .findById(transactionId)
                .orElseThrow(
                        () -> new EntityNotFoundException("Transaction not found for the ID:" + transactionId)
                );
    }

    public Transaction updateTransactionStatus(Long transactionId, TransactionStatus status) {
        Transaction transaction = getTransaction(transactionId);
        transaction.setTransactionStatus(status);
        return transactionRepo.save(transaction);
    }

    public Transaction updateTransactionMethod(Long transactionId, TransactionMethod method) {
        Transaction transaction = getTransaction(transactionId);
        transaction.setTransactionMethod(method);
        return transactionRepo.save(transaction);
    }

    // Overloaded method to set description along with transaction method
    public Transaction updateTransactionMethod(Long transactionId, TransactionMethod method, String description) {
        Transaction transaction = getTransaction(transactionId);
        transaction.setTransactionMethod(method);
        transaction.setDescription(description);
        return transactionRepo.save(transaction);
    }

    public Page<Transaction> getLatestTransactionsByCustomer(String customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Customer customer = customerService.getCustomer(customerId);
        return transactionRepo.findByCustomerOrderByCreatedAt(customer, pageable);
    }


    //Paginated Transactions
    public Page<Transaction> getPaginatedTransactions(int pageNo, int size, String sortField, String sortOrder, String search) {
        if ("customer".equals(sortField)) {
            sortField = "customer.personalDetails.firstName";
        }
        Sort sort = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sort);
        Page<Transaction> page;

        if (search != null && !search.isEmpty()) {
            page =  transactionRepo.searchByCustomerName(search, pageable);
        } else {
            page =  transactionRepo.findAll(pageable);
        }

        return page;
    }

    //Recent Transaction
    public Page<Transaction> getRecentTransactions() {
        Pageable pageable = PageRequest.of(0,5);
       return  transactionRepo.findByOrderByCreatedAtDesc(pageable);
    }

    public Long getCountOfTransactions() {
        return  transactionRepo.count();
    }

    public Long getCountOfPendingTransaction(){
        return transactionRepo.countByTransactionStatus(TransactionStatus.PENDING);
    }

    public Optional<Transaction> getTransactionByInvoice(Invoice invoice) {
        return Optional.ofNullable(transactionRepo.findByInvoiceIdAndTransactionStatus(invoice.getId(), TransactionStatus.SUCCESS));
    }
}
