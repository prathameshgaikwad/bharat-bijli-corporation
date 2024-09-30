import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import {
  LoginRequest,
  LoginResponse,
  OtpResponse,
  RegistrationResponse,
} from '../shared/types/auth';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalDetails } from '../shared/types/user';

export interface DecodedToken extends JwtPayload {
  userId: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      return decoded;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role ?? null;
  }

  getUserId(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.userId || null;
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  isCustomer(): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.role === 'CUSTOMER';
  }

  isEmployee(): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.role === 'EMPLOYEE';
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

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
