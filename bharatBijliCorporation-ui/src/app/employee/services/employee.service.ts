import { Customer, Employee } from '../../shared/types/user.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Invoice,
  InvoiceResponse,
  Page,
  Transaction,
} from '../../shared/types/consumables.types';

import { Injectable } from '@angular/core';
import { InvoiceCustResp } from '../generate-invoices/generate-invoices.component';
import { Observable } from 'rxjs';
import { UsernameResponse } from '../../shared/types/auth.types';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/employees';
  private baseTransactionsUrl = 'http://localhost:8080/transactions';
  private baseInvoicesUrl = 'http://localhost:8080/invoices';
  private baseCustUrl = 'http://localhost:8080/customers';

  constructor(private httpClient: HttpClient) {}

  getEmployeeDetails(employeeId: string): Observable<Employee> {
    const url = `${this.baseUrl}/${employeeId}`;
    return this.httpClient.get<Employee>(url);
  }

  getEmployeeUsername(employeeId: string): Observable<UsernameResponse> {
    const url = `${this.baseUrl}/${employeeId}/username`;
    return this.httpClient.get<UsernameResponse>(url);
  }

  getCountOfCustomers(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/customers`);
  }

  getCountOfTransaction(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseTransactionsUrl}/count`);
  }

  getCountOfInvoices(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseInvoicesUrl}/count`);
  }

  getCountOfPendingTransactions(): Observable<number> {
    return this.httpClient.get<number>(
      `${this.baseTransactionsUrl}/pendings/count`
    );
  }

  generateInvoice(
    billingDetails: InvoiceResponse
  ): Observable<InvoiceCustResp> {
    return this.httpClient.post<InvoiceCustResp>(
      `${this.baseInvoicesUrl}`,
      billingDetails
    );
  }

  getPaidTransactionByInvoice(invoice: Invoice): Observable<Transaction> {
    return this.httpClient.post<Transaction>(
      `${this.baseTransactionsUrl}/invoice/paid`,
      invoice
    );
  }

  getPaginatedTransactions(
    page: number = 0,
    size: number = 10,
    sortField: string = 'createdAt',
    sortOrder: string = 'asc',
    searchQuery: string
  ): Observable<Page<Transaction>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder)
      .set('search', searchQuery);
    return this.httpClient.get<Page<Transaction>>(
      `${this.baseTransactionsUrl}`,
      { params }
    );
  }

  getRecentTransactions(): Observable<Page<Transaction>> {
    return this.httpClient.get<Page<Transaction>>(
      `${this.baseTransactionsUrl}/recents`
    );
  }

  getPaginatedInvoices(
    page: number = 0,
    size: number = 10,
    sortField: string,
    sortOrder: string = 'asc',
    searchQuery: string
  ): Observable<Page<Invoice>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder)
      .set('search', searchQuery);
    return this.httpClient.get<Page<Invoice>>(`${this.baseInvoicesUrl}`, {
      params,
    });
  }

  getPaginatedCustomers(
    page: number = 0,
    size: number = 10,
    sortField: string,
    sortOrder: string = 'asc',
    searchQuery: string
  ): Observable<Page<Customer>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder)
      .set('search', searchQuery);
    return this.httpClient.get<Page<Customer>>(`${this.baseCustUrl}`, {
      params,
    });
  }
}
