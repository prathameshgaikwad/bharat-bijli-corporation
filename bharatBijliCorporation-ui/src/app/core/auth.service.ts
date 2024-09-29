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

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  dateOfBirth: Date;
}

export interface LoginResponse {
  message: string;
  role: string;
}

export interface RegistrationResponse {
  customerId: string;
  firstName: string;
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

  register(personalDetails: PersonalDetails): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(
      `${this.baseUrl}/register`,
      personalDetails,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}
