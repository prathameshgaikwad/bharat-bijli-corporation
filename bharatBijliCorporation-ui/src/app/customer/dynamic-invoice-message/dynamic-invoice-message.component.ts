import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Invoice,
  InvoicesByStatusResponse,
} from '../../shared/types/consumables.types';

import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { DEFAULT_INVOICE } from '../../core/helpers/constants';
import { DialogModule } from 'primeng/dialog';
import { InvoiceStatus } from '../../shared/types/enums.types';
import { InvoiceSummaryComponent } from '../invoices/invoice-summary/invoice-summary.component';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { Router } from '@angular/router';
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
  @Input() isHomeReferrer: boolean = false;
  @Input() invoiceStatus: InvoiceStatus = InvoiceStatus.PENDING;
  @Input() severity: 'success' | 'info' | 'warn' | 'error' = 'info';
  @Output() invoicesPresenceChecked = new EventEmitter<boolean>();
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
  selectedInvoiceDetails: Invoice = DEFAULT_INVOICE;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.customerId = this.authService.getCurrentUserId();
    this.loadPendingDues();
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
              this.handlePresenceCheck(this.totalAmount);
              if (
                response &&
                response.invoices &&
                response.invoices.content.length > 0
              ) {
                this.selectedInvoiceDetails = response.invoices.content[0];
              } else {
                this.selectedInvoiceDetails = DEFAULT_INVOICE;
              }
              this.isLoading = false;
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.invoicesPresenceChecked.emit(false);
            console.error(error);
          },
        });
    }
  }

  handlePresenceCheck(totalAmount: number) {
    if (this.isHomeReferrer && totalAmount > 0)
      this.invoicesPresenceChecked.emit(true);
    else this.invoicesPresenceChecked.emit(false);
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
        if (this.isHomeReferrer) {
          this.router.navigateByUrl('/customer/invoices');
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'More than 1 bills need action',
            detail: 'Click on an individual bill to pay',
          });
        }
      }
    }
  }
}
