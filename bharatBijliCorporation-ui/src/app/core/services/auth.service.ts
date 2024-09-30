import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import {
  LoginRequest,
  LoginResponse,
  OtpResponse,
  RegistrationResponse,
} from '../../shared/types/auth';
import { Observable, tap } from 'rxjs';

import { AppStateService } from './app-state.service';
import { Injectable } from '@angular/core';
import { PersonalDetails } from '../../shared/types/user';

export interface DecodedToken extends JwtPayload {
  userId: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_API = 'http://localhost:8080/auth';
  private readonly tokenKey = 'token';

  constructor(
    private http: HttpClient,
    private appStateService: AppStateService
  ) {}

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
    return this.http.get<OtpResponse>(`${this.AUTH_API}/getOtp`, { params });
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.AUTH_API}/login`, loginRequest, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          const decodedToken = this.getDecodedToken();
          if (decodedToken) {
            this.appStateService.setUserId(decodedToken.userId);
            this.appStateService.setRole(decodedToken.role);
          }
        })
      );
  }

  register(personalDetails: PersonalDetails): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(
      `${this.AUTH_API}/register`,
      personalDetails,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  logout() {
    return this.http
      .post(
        `${this.AUTH_API}/logout`,
        {},
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          this.clearToken();
          this.appStateService.setRole('GUEST');
          this.appStateService.setUserId('');
        })
      );
  }
}
