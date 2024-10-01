import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, catchError, of, takeUntil } from 'rxjs';

import { AppStateService } from '../../core/services/app-state.service';
import { CommonModule } from '@angular/common';
import { Customer } from '../../shared/types/user';
import { CustomerNavbarComponent } from '../customer-navbar/customer-navbar.component';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CustomerNavbarComponent, CommonModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css',
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  customerDetails$!: Observable<Customer | null>;
  customerId: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private appStateService: AppStateService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    console.log('Dashboard');

    this.appStateService
      .getUserId()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userId) => {
          this.customerId = userId || '';
          if (this.customerId && this.appStateService.getRole()) {
            this.loadCustomerDetails(this.customerId);
          } else {
            console.error('No customer ID found');
          }
        },
        error: (err) => {
          console.error('Error fetching user ID', err);
        },
      });
  }

  private loadCustomerDetails(customerId: string): void {
    this.customerDetails$ = this.customerService
      .getCustomerDetails(customerId)
      .pipe(
        catchError((error) => {
          console.error('Failed to load customer details', error);
          return of(null);
        })
      );
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
