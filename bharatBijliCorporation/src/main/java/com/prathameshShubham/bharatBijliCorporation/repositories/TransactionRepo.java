package com.prathameshShubham.bharatBijliCorporation.repositories;

import com.prathameshShubham.bharatBijliCorporation.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Long> {
}
