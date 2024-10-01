import {
  Invoice,
  Page,
  Transaction,
} from '../../shared/types/consumables.types';

import { Customer } from '../../shared/types/user.types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsernameResponse } from '../../shared/types/auth.types';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/customers';

  constructor(private httpClient: HttpClient) {}

  getInvoices(
    customerId: string,
    page: number = 0,
    size: number = 10
  ): Observable<Page<Invoice>> {
    const url = `${this.baseUrl}/${customerId}/invoices?page=${page}&size=${size}`;
    return this.httpClient.get<Page<Invoice>>(url);
  }

  getTransactions(
    customerId: string,
    page: number = 0,
    size: number = 10
  ): Observable<Page<Transaction>> {
    const url = `${this.baseUrl}/${customerId}/transactions?page=${page}&size=${size}`;
    return this.httpClient.get<Page<Transaction>>(url);
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
