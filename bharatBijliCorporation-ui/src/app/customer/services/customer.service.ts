import { Customer } from '../../shared/types/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsernameResponse } from '../../shared/types/auth';

export interface Invoice {
  id: string;
  customerId: string;
  unitsConsumed: number;
  tariff: number;
  periodStartDate: Date;
  periodEndDate: Date;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIALLY_PAID' | 'VOID';
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

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

  getCustomerDetails(customerId: string): Observable<Customer> {
    const url = `${this.baseUrl}/${customerId}`;
    return this.httpClient.get<Customer>(url);
  }

  getCustomerUsername(customerId: string): Observable<UsernameResponse> {
    const url = `${this.baseUrl}/${customerId}/username`;
    return this.httpClient.get<UsernameResponse>(url);
  }
}
