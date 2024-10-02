import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { AppStateService } from '../../core/services/app-state.service';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { InvoiceStatus } from '../../shared/types/enums.types';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { PendingDuesComponent } from '../pending-dues/pending-dues.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule, PendingDuesComponent],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css',
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  customerId: string = '';
  username: string = '';
  private destroy$ = new Subject<void>();
  private subscription!: Subscription;
  isBillsPending!: boolean;
  isBillsOverdue!: boolean;
  overDueInvoiceStatus: InvoiceStatus = InvoiceStatus.OVERDUE;

  constructor(
    private appStateService: AppStateService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.subscription = this.appStateService
      .getUsername()
      .subscribe((username) => {
        this.username = username;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
