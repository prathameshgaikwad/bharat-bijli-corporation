package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.enums.TransactionMethod;
import com.prathameshShubham.bharatBijliCorporation.enums.TransactionStatus;
import com.prathameshShubham.bharatBijliCorporation.models.Transaction;
import com.prathameshShubham.bharatBijliCorporation.repositories.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepo transactionRepo;

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepo.save(transaction);
    }

    public Transaction getTransaction(Long transactionId) {
        return transactionRepo
                .findById(transactionId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Transaction not found for the ID:" + transactionId)
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
}
