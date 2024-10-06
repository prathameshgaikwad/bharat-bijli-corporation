import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActionsPanelComponent } from './actions-panel/actions-panel.component';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { DynamicInvoiceMessage } from '../dynamic-invoice-message/dynamic-invoice-message.component';
import { InvoiceStatus } from '../../shared/types/enums.types';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { PanelModule } from 'primeng/panel';
import { Subject } from 'rxjs';
import { UsageChartComponent } from './usage-chart/usage-chart.component';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    DynamicInvoiceMessage,
    CardModule,
    ButtonModule,
    PanelModule,
    UsageChartComponent,
    ActionsPanelComponent,
  ],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css',
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  customerId: string = '';
  walletBalance: number = 0.0;
  private destroy$ = new Subject<void>();
  isPendingBill: boolean;
  isOverdueBill: boolean;
  isActionRequired: boolean;
  overDueInvoiceStatus: InvoiceStatus = InvoiceStatus.OVERDUE;
  pendingInvoiceStatus: InvoiceStatus = InvoiceStatus.PENDING;

  constructor(
    private authService: AuthService,
    private walletService: WalletService
  ) {
    this.isOverdueBill = true;
    this.isPendingBill = true;
    this.isActionRequired = true;
  }

  ngOnInit(): void {
    this.customerId = this.authService.getCurrentUserId();

    if (this.customerId) {
      this.walletService.loadWalletBalance(this.customerId).subscribe({
        next: (balance) => {
          this.walletBalance = balance;
        },
      });
    }
  }

  onPendingInvoicesChecked(hasPending: boolean): void {
    this.isPendingBill = hasPending;
    this.updateActionRequired();
  }

  onOverdueInvoicesChecked(hasOverdue: boolean): void {
    this.isOverdueBill = hasOverdue;
    this.updateActionRequired();
  }

  private updateActionRequired(): void {
    this.isActionRequired = this.isPendingBill || this.isOverdueBill;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
