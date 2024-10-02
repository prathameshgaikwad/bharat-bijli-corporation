package com.prathameshShubham.bharatBijliCorporation.dto;

import com.prathameshShubham.bharatBijliCorporation.enums.InvoiceStatus;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;


@Getter
@Setter
public class InvoicesByStatusResponse {
    private double invoiceAmountTotal;
    private InvoiceStatus invoiceStatus;
    private Page<InvoiceDTO> invoices;

    public InvoicesByStatusResponse(double invoiceAmountTotal, InvoiceStatus invoiceStatus, Page<InvoiceDTO> invoices) {
        this.invoiceAmountTotal = invoiceAmountTotal;
        this.invoiceStatus = invoiceStatus;
        this.invoices = invoices;
    }
}
