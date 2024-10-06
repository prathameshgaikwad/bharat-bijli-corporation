import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CustomerService } from './customer.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private walletBalanceSubject = new BehaviorSubject<number | null>(null);
  walletBalance$ = this.walletBalanceSubject.asObservable();

  constructor(private customerService: CustomerService) {}

  loadWalletBalance(customerId: string): Observable<number> {
    return this.customerService
      .getWalletBalance(customerId)
      .pipe(tap((balance) => this.walletBalanceSubject.next(balance)));
  }

  updateWalletBalance(newBalance: number): void {
    this.walletBalanceSubject.next(newBalance);
  }

  hasEnoughBalance(amount: number): Observable<boolean> {
    return this.walletBalance$.pipe(
      map((balance) => balance !== null && balance >= amount)
    );
  }
}
