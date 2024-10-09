package com.prathameshShubham.bharatBijliCorporation.controllers;

import com.itextpdf.layout.element.Tab;
import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import com.prathameshShubham.bharatBijliCorporation.models.Transaction;
import com.prathameshShubham.bharatBijliCorporation.response.ApiResponse;
import com.prathameshShubham.bharatBijliCorporation.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ApiResponse<Page<Transaction>>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "asc") String sortOrder,
            @RequestParam(required = false) String search) {

        Page<Transaction> chunk = transactionService.getPaginatedTransactions(page, size, sortField, sortOrder, search);

        if(chunk.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Transaction not found.... !", 404));
        }

        return ResponseEntity.ok(ApiResponse.success(chunk, "Transactions fetched successfully.", 200));
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

    @GetMapping("pendings/count")
    public  ResponseEntity<Long> getCountOfPendingTransactions(){
        return  ResponseEntity.ok(transactionService.getCountOfPendingTransaction());
    }

    @PostMapping("/invoice/paid")
    public ResponseEntity<Transaction> getTransactionByInvoice(@RequestBody Invoice invoice) {
        return transactionService.getTransactionByInvoice(invoice)
                .map(ResponseEntity::ok)           // If found, return 200 OK with the transaction
                .orElseGet(() -> ResponseEntity.notFound().build()); // If not found, return 404 Not Found
    }
}
