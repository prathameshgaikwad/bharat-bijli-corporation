import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Invoice,
  InvoicesByStatusResponse,
  Page,
  PendingDuesResponse,
  RecordPaymentRequest,
  Transaction,
} from '../../shared/types/consumables.types';

import { Customer } from '../../shared/types/user.types';
import { Injectable } from '@angular/core';
import { InvoiceStatus } from '../../shared/types/enums.types';
import { Observable } from 'rxjs';
import { UsernameResponse } from '../../shared/types/auth.types';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/customers';

  constructor(private httpClient: HttpClient) {}

  getCustomerInvoiceById(
    customerId: string,
    invoiceId: string
  ): Observable<Invoice> {
    const url = `${this.baseUrl}/${customerId}/invoices/${invoiceId}`;
    return this.httpClient.get<Invoice>(url);
  }

  downloadInvoicePdf(customerId: string, invoiceId: string): Observable<Blob> {
    const url = `${this.baseUrl}/${customerId}/invoices/${invoiceId}/pdf`;
    const options = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        Accept: 'application/pdf',
      }),
    };

    return this.httpClient.get<Blob>(url, options);
  }

  getInvoices(
    customerId: string,
    page: number = 0,
    size: number = 10
  ): Observable<Page<Invoice>> {
    const url = `${this.baseUrl}/${customerId}/invoices?page=${page}&size=${size}`;
    return this.httpClient.get<Page<Invoice>>(url);
  }

  getInvoicesByStatus(
    customerId: string,
    invoiceStatus: InvoiceStatus,
    page: number = 0,
    size: number = 10
  ): Observable<InvoicesByStatusResponse> {
    const url = `${this.baseUrl}/${customerId}/invoices/status/${invoiceStatus}?page=${page}&size=${size}`;
    return this.httpClient.get<InvoicesByStatusResponse>(url);
  }

  getTransactions(
    customerId: string,
    page: number = 0,
    size: number = 10
  ): Observable<Page<Transaction>> {
    const url = `${this.baseUrl}/${customerId}/transactions?page=${page}&size=${size}`;
    return this.httpClient.get<Page<Transaction>>(url);
  }

  recordPayment(paymentRequest: RecordPaymentRequest): Observable<Transaction> {
    const url = `${this.baseUrl}/record-payment`;
    return this.httpClient.post<Transaction>(url, paymentRequest);
  }

  getCustomerDetails(customerId: string): Observable<Customer> {
    const url = `${this.baseUrl}/${customerId}`;
    return this.httpClient.get<Customer>(url);
  }

  getCustomerUsername(customerId: string): Observable<UsernameResponse> {
    const url = `${this.baseUrl}/${customerId}/username`;
    return this.httpClient.get<UsernameResponse>(url);
  }
}
