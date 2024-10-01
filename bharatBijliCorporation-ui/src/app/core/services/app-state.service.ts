import { BehaviorSubject, Observable, map } from 'rxjs';

import { Injectable } from '@angular/core';

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

  constructor() {}

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
}
