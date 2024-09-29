import { HttpClient, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface OtpResponse {
  message: string;
  otp: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  getOtp(userId: string): Observable<OtpResponse> {
    const params = new HttpParams().set('id', userId);
    return this.http.get<OtpResponse>(`${this.baseUrl}/getOtp`, { params });
  }

  login(customerId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, customerId);
  }
}
