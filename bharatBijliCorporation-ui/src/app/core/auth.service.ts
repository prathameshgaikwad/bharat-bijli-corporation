import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface OtpResponse {
  message: string;
  otp: string;
}

export interface LoginRequest {
  userId: string;
  otp: string;
}

export interface LoginResponse {
  message: string;
  role: string;
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

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      loginRequest,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}
