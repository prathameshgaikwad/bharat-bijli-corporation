import { Customer, Employee, PersonalDetails } from '../../shared/types/user.types';
import {
  Invoice,
  InvoiceResponse,
  Page,
  RecordPaymentRequest,
  Transaction,
} from '../../shared/types/consumables.types';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsernameResponse } from '../../shared/types/auth.types';
import { InvoiceCustResp } from '../invoice-template/generate-invoices/generate-invoices.component';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/employees';
  private baseTransactionsUrl = 'http://localhost:8080/transactions';
  private baseInvoicesUrl = 'http://localhost:8080/invoices';

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
      .set('sortField', 'id')
      .set('sortOrder', sortOrder)  
      .set('search', searchQuery);
    return this.httpClient.get<Page<Customer>>(`${this.baseUrl}/getAll/Customers`, {
      params,
    });
  }

  postBulkCsvCust(file : File) : Observable<string>{
    const formData: FormData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.httpClient.post<string>(`${this.baseUrl}/customers/bulk-csv-upload`, formData, { responseType: 'text' as 'json' })
  }

  postBulkCsvInv(file : File) : Observable<string>{
    const formData: FormData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
     const empId = "EMP000001"
    return this.httpClient.post<string>(`${this.baseInvoicesUrl}/${empId}/bulk-csv-upload`, formData, { responseType: 'text' as 'json' })
  }

  updateCustomer(updatedDetails : Customer) : Observable<PersonalDetails>{
    console.log(updatedDetails);
    
    return this.httpClient.put<PersonalDetails>(`${this.baseUrl}/update/customer`, updatedDetails);
  }

  addCashPayment(paymentRequest: RecordPaymentRequest): Observable<Transaction> {
    const url = `${this.baseUrl}/record-payment`;
    return this.httpClient.post<Transaction>(url, paymentRequest);
  }
}
