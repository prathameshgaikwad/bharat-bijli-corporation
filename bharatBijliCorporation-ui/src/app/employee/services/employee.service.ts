import { Customer } from '../../shared/types/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsernameResponse } from '../../shared/types/auth';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/employees';

  constructor(private httpClient: HttpClient) {}

  getEmployeeDetails(employeeId: string): Observable<Customer> {
    const url = `${this.baseUrl}/${employeeId}`;
    return this.httpClient.get<Customer>(url);
  }

  getEmployeeUsername(employeeId: string): Observable<UsernameResponse> {
    const url = `${this.baseUrl}/${employeeId}/username`;
    return this.httpClient.get<UsernameResponse>(url);
  }
}
