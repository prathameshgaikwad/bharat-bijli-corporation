package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.dto.RecordPaymentRequest;
import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import com.prathameshShubham.bharatBijliCorporation.enums.TransactionMethod;
import com.prathameshShubham.bharatBijliCorporation.enums.TransactionStatus;
import com.prathameshShubham.bharatBijliCorporation.exceptions.InsufficientFundsException;
import com.prathameshShubham.bharatBijliCorporation.exceptions.InvoiceAlreadyPaidException;
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

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private InvoiceService invoiceService;

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepo.save(transaction);
    }

    public Transaction savePaymentByCustomer(RecordPaymentRequest request, Customer customer, Invoice invoice) throws Exception {
        if(invoice.getInvoiceStatus().equals(InvoiceStatus.PAID)) {
            throw new InvoiceAlreadyPaidException();
        }

        if(request.getPaymentMethod().equals(TransactionMethod.WALLET)) {
            customerService.updateBalance(customer.getId(), request.getTotalAmount());
        }

        Transaction transaction = new Transaction();
        transaction.setCustomer(customer);
        transaction.setInvoice(invoice);
        transaction.setAmount(request.getTotalAmount() != null ? request.getTotalAmount() : BigDecimal.ZERO);
        transaction.setDiscountByDueDate(request.getDiscountByDueDate() != null ? request.getDiscountByDueDate() : BigDecimal.ZERO);
        transaction.setDiscountByOnlinePayment(request.getDiscountByOnlinePayment() != null ? request.getDiscountByOnlinePayment() : BigDecimal.ZERO);
        transaction.setTransactionMethod(request.getPaymentMethod());
        transaction.setDescription(request.getPaymentDescription());
        transaction.setTransactionReference(request.getTransactionReference());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setTransactionStatus(TransactionStatus.SUCCESS); // Assuming the transaction is completed upon recording
        invoiceService.updateInvoiceStatus(invoice.getId(), InvoiceStatus.PAID);
        // Save the transaction
        return saveTransaction(transaction); // Call saveTransaction to persist the transaction
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
        return transactionRepo.findByCustomerOrderByTransactionDateDesc(customer, pageable);
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
            if(page.isEmpty()){
                page = transactionRepo.findByCustomerId(search, pageable);
            }
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
