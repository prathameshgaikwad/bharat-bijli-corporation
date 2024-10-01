package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.prathameshShubham.bharatBijliCorporation.models.Transaction;
import com.prathameshShubham.bharatBijliCorporation.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Transaction> saveTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.saveTransaction(transaction));
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<Transaction> getTransaction(@PathVariable Long transactionId) {
        return ResponseEntity.ok(transactionService.getTransaction(transactionId));
    }

    @GetMapping
    public ResponseEntity<Page<Transaction>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(transactionService.getPaginatedTransactions(page, size));
    }

    @GetMapping("/recents")
    public ResponseEntity<Page<Transaction>> getRecentTransactions() {
            Page<Transaction> page = transactionService.getRecentTransactions();
            return ResponseEntity.ok(page);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCountOfTransactions(){
        return ResponseEntity.ok(transactionService.getCountOfTransactions());
    }
}
