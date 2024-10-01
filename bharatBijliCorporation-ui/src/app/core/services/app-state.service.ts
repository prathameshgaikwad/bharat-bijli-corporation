import { AuthService, DecodedToken } from './auth.service';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private roleSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    'GUEST'
  );

  private userIdSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  private usernameSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  constructor() {
    this.initializeStateFromToken();
  }

  private initializeStateFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        const userId = decoded.sub;
        const role = decoded.role;

        if (userId) {
          this.userIdSubject.next(userId);
        }

        if (role) {
          this.roleSubject.next(role);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  public getRole(): Observable<string> {
    return this.roleSubject.asObservable();
  }

  public setRole(role: string): void {
    this.roleSubject.next(role);
  }

  public getUserId(): Observable<string> {
    return this.userIdSubject.asObservable();
  }

  public setUserId(id: string): void {
    this.userIdSubject.next(id);
  }

  public getUsername(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  public setUsername(username: string): void {
    this.usernameSubject.next(username);
  }

  public clearState(): void {
    this.userIdSubject.next('');
    this.roleSubject.next('GUEST');
    this.usernameSubject.next('');
  }
}
