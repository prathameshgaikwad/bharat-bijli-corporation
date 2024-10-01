import { Employee } from '../../shared/types/user.types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsernameResponse } from '../../shared/types/auth.types';
import { Page, Transaction } from '../../shared/types/consumables.types';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/employees';
  private baseTransactionsUrl = 'http://localhost:8080/transactions';

  constructor(private httpClient: HttpClient) {}

  getEmployeeDetails(employeeId: string): Observable<Employee> {
    const url = `${this.baseUrl}/${employeeId}`;
    return this.httpClient.get<Employee>(url);
  }

  getEmployeeUsername(employeeId: string): Observable<UsernameResponse> {
    const url = `${this.baseUrl}/${employeeId}/username`;
    return this.httpClient.get<UsernameResponse>(url);
  }

  getRecentTransactions() : Observable<Page<Transaction>>{
    return this.httpClient.get<Page<Transaction>> (`${this.baseTransactionsUrl}/recents`);
  }
}
