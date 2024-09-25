package com.prathameshShubham.bharatBijliCorporation.repositories;

import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepo extends JpaRepository<Invoice, Long> {
}
