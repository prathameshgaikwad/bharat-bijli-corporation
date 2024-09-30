import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  LoginRequest,
  LoginResponse,
  OtpResponse,
  RegistrationResponse,
} from '../shared/types/auth';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalDetails } from '../shared/types/user';

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

  logout() {
    return this.http.post(
      `${this.baseUrl}/logout`,
      {},
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        withCredentials: true,
      }
    );
  }
}
