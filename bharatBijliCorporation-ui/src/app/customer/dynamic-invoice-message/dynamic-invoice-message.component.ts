import { Component, Input, OnInit } from '@angular/core';
import {
  Invoice,
  InvoicesByStatusResponse,
  defaultInvoice,
} from '../../shared/types/consumables.types';

import { AppStateService } from '../../core/services/app-state.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { DialogModule } from 'primeng/dialog';
import { InvoiceStatus } from '../../shared/types/enums.types';
import { InvoiceSummaryComponent } from '../invoices/invoice-summary/invoice-summary.component';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dynamic-invoice-message',
  standalone: true,
  imports: [
    MessagesModule,
    CommonModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    InvoiceSummaryComponent,
  ],
  providers: [MessageService],
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
  isLoading: boolean = false;
  totalAmount: number = 0;
  totalInvoicesCount: number = 0;
  isInvoiceSummaryVisible: boolean = false;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  selectedInvoiceDetails: Invoice = defaultInvoice;

  constructor(
    private appStateService: AppStateService,
    private customerService: CustomerService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.appStateService.getUserId().subscribe((userId) => {
      this.customerId = userId;
      this.loadPendingDues();
    });
    this.setButtonSeverity();
  }

  loadPendingDues(page: number = 0): void {
    if (this.customerId) {
      this.customerService
        .getInvoicesByStatus(this.customerId, this.invoiceStatus, page)
        .subscribe({
          next: (response: InvoicesByStatusResponse) => {
            if (response) {
              this.totalAmount = response.invoiceAmountTotal;
              this.totalInvoicesCount = response.invoices.totalElements;
              if (
                response &&
                response.invoices &&
                response.invoices.content.length > 0
              ) {
                this.selectedInvoiceDetails = response.invoices.content[0];
              } else {
                this.selectedInvoiceDetails = defaultInvoice;
              }
              this.isLoading = false;
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.error(error);
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

  showInvoiceSummary() {
    this.isInvoiceSummaryVisible = true;
  }

  navigate() {
    if (this.customerId) {
      if (this.totalInvoicesCount === 1) {
        this.showInvoiceSummary();
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'Need action',
          detail: 'Click on an individual bill to pay',
        });
      }
    }
  }
}
