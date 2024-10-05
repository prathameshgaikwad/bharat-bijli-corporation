import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActionsPanelComponent } from './actions-panel/actions-panel.component';
import { AppStateService } from '../../core/services/app-state.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DynamicInvoiceMessage } from '../dynamic-invoice-message/dynamic-invoice-message.component';
import { InvoiceStatus } from '../../shared/types/enums.types';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { PanelModule } from 'primeng/panel';
import { Subject } from 'rxjs';
import { UsageChartComponent } from './usage-chart/usage-chart.component';

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
  walletBalance: number = 1258.3;
  private destroy$ = new Subject<void>();
  isPendingBill: boolean;
  isOverdueBill: boolean;
  isActionRequired: boolean;
  overDueInvoiceStatus: InvoiceStatus = InvoiceStatus.OVERDUE;
  pendingInvoiceStatus: InvoiceStatus = InvoiceStatus.PENDING;

  constructor(private appStateService: AppStateService) {
    this.isOverdueBill = true;
    this.isPendingBill = true;
    this.isActionRequired = true;
  }

  ngOnInit(): void {
    this.appStateService.getUserId().subscribe((id) => {
      this.customerId = id;
    });
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
