import { Component, Input, OnInit } from '@angular/core';

import { AppStateService } from '../../core/services/app-state.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { InvoiceStatus } from '../../shared/types/enums.types';
import { InvoicesByStatusResponse } from '../../shared/types/consumables.types';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-dynamic-invoice-message',
  standalone: true,
  imports: [MessagesModule, CommonModule, ButtonModule],
  templateUrl: './dynamic-invoice-message.component.html',
  styleUrl: './dynamic-invoice-message.component.css',
})
export class DynamicInvoiceMessage implements OnInit {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttonLabel: string = '';
  @Input() customerId: string = '';
  @Input() invoiceStatus: InvoiceStatus = InvoiceStatus.PENDING;
  @Input() severity: 'success' | 'info' | 'warn' | 'error' = 'info';
  buttonSeverity:
    | 'success'
    | 'info'
    | 'secondary'
    | 'warning'
    | 'danger'
    | 'contrast'
    | 'help'
    | 'primary'
    | null
    | undefined = 'info';
  totalAmount: number = 0;
  isLoadingPendingDues: boolean = false;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  constructor(
    private appStateService: AppStateService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.appStateService.getUserId().subscribe((userId) => {
      this.customerId = userId;
      this.loadPendingDues();
    });
    this.setButtonSeverity();
  }

  loadPendingDues(page: number = this.currentPage): void {
    if (this.customerId) {
      this.isLoadingPendingDues = true;

      this.customerService
        .getInvoicesByStatus(
          this.customerId,
          this.invoiceStatus,
          page,
          this.pageSize
        )
        .subscribe({
          next: (response: InvoicesByStatusResponse | null) => {
            if (response) {
              this.totalAmount = response.invoiceAmountTotal;
              this.isLoadingPendingDues = false;
            }
          },
          error: (error) => {
            this.isLoadingPendingDues = false;
            console.error(
              `Error loading  ${this.invoiceStatus} invoices`,
              error
            );
          },
        });
    }
  }

  setButtonSeverity() {
    switch (this.severity) {
      case 'warn':
        this.buttonSeverity = 'warning';
        return;
      case 'error':
        this.buttonSeverity = 'danger';
        return;
      default:
        this.buttonSeverity = this.severity;
    }
  }
}
