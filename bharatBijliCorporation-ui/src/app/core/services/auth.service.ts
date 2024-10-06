import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import {
  LoginRequest,
  LoginResponse,
  OtpResponse,
  RegistrationResponse,
  UsernameResponse,
} from '../../shared/types/auth.types';

import { Injectable } from '@angular/core';
import { PersonalDetails } from '../../shared/types/user.types';

export interface DecodedToken extends JwtPayload {
  sub: string;
  role: string;
}
export interface AuthState {
  isAuthenticated: boolean;
  userId?: string;
  role?: string;
  username?: string;
}

interface TokenValidationResponse {
  valid: boolean;
  userId: string;
  role: string;
  username: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_API = 'http://localhost:8080/auth';
  private readonly CUSTOMER_API = 'http://localhost:8080/customers';
  private readonly EMPLOYEE_API = 'http://localhost:8080/employees';
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    role: 'GUEST',
    username: 'GUEST',
    userId: '',
  });

  constructor(private http: HttpClient) {}

  checkAuthState(): Observable<boolean> {
    return this.http
      .get<TokenValidationResponse>(`${this.AUTH_API}/validate-token`)
      .pipe(
        map((response) => {
          const newState: AuthState = {
            isAuthenticated: response.valid,
            userId: response.userId,
            role: response.role,
            username: response.username,
          };
          this.authStateSubject.next(newState);
          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          const newState: AuthState = {
            isAuthenticated: false,
            role: 'GUEST',
            username: 'GUEST',
          };
          this.authStateSubject.next(newState);
          console.error('Auth Error:', error);
          return [false];
        })
      );
  }

  get authState$(): Observable<AuthState> {
    return this.authStateSubject.asObservable();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.authState$.pipe(map((state) => state.isAuthenticated));
  }

  getCurrentUserRole(): string {
    return this.authStateSubject.value.role || 'GUEST';
  }

  getCurrentUserId(): string {
    return this.authStateSubject.value.userId || '';
  }

  getCurrentUsername(): string {
    return this.authStateSubject.value.username || 'GUEST';
  }

  updateAuthState(newState: AuthState): void {
    this.authStateSubject.next(newState);
  }

  getAuthState(): AuthState {
    return this.authStateSubject.value;
  }

  clearState() {
    this.authStateSubject.next({
      isAuthenticated: false,
      role: 'GUEST',
      username: 'GUEST',
    });
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
          this.handleLoginResponse(response);
        })
      );
  }

  private handleLoginResponse(loginResponse: LoginResponse): void {
    const partialState: AuthState = {
      isAuthenticated: true,
      userId: loginResponse.userId,
      role: loginResponse.role,
    };
    this.authStateSubject.next(partialState);
    this.fetchUsername(loginResponse.role, loginResponse.userId);
  }

  private fetchUsername(role: string, userId: string): void {
    if (role === 'CUSTOMER') {
      this.getCustomerUsername(userId).subscribe({
        next: (response: UsernameResponse) => {
          const newState: AuthState = {
            username: response.username,
            ...this.authStateSubject.value,
          };
          this.updateAuthState(newState);
        },
        error: (err) => {
          console.error('Failed to fetch customer username:', err);
        },
      });
    } else if (role === 'EMPLOYEE') {
      this.getEmployeeUsername(userId).subscribe({
        next: (response: UsernameResponse) => {
          console.log(response.username);

          const newState: AuthState = {
            username: response.username,
            ...this.authStateSubject.value,
          };
          this.updateAuthState(newState);
        },
        error: (err) => {
          console.error('Failed to fetch employee username:', err);
        },
      });
    }
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
          this.clearState();
        })
      );
  }

  getCustomerUsername(customerId: string): Observable<UsernameResponse> {
    return this.http.get<UsernameResponse>(
      `${this.CUSTOMER_API}/${customerId}/username`
    );
  }

  getEmployeeUsername(employeeId: string): Observable<UsernameResponse> {
    return this.http.get<UsernameResponse>(
      `${this.EMPLOYEE_API}/${employeeId}/username`
    );
  }

  refreshToken() {
    return this.http.post(`${this.AUTH_API}/refresh`, {});
  }
}
