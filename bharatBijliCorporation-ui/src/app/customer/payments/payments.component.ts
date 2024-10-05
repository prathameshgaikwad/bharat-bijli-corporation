import { Page, Transaction } from '../../shared/types/consumables.types';

import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { DEFAULT_TRANSACTION } from '../../core/helpers/constants';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    NavbarComponent,
    TagModule,
    TableModule,
    CommonModule,
    ButtonModule,
    PaymentSummaryComponent,
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class PaymentsComponent {
  transactions: Transaction[] = [];
  selectedTransaction!: Transaction;
  isTransactionSummaryVisible: boolean = false;
  customerId: string = '';
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerId = this.authService.getCurrentUserId();
  }

  loadTransactions(
    page: number = this.currentPage,
    size: number = this.pageSize
  ): void {
    if (this.customerId) {
      this.customerService
        .getTransactions(this.customerId, page, size)
        .subscribe({
          next: (response: Page<Transaction>) => {
            this.transactions = response.content;
            this.totalPages = response.totalPages;
            this.totalRecords = response.totalElements;
          },
          error: (error) => {
            console.error('Error fetching invoices:', error);
          },
        });
    }
  }

  onLazyLoad(event: any): void {
    const page = event.first / event.rows;
    const size = event.rows;
    this.currentPage = page;
    this.pageSize = size;
    this.loadTransactions(page, size);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'secondary';
      case 'FAILED':
        return 'danger';
      case 'DECLINED':
        return 'danger';
      case 'EXPIRED':
        return 'secondary';
      default:
        return 'info';
    }
  }

  getIcon(status: string) {
    switch (status) {
      case 'SUCCESS':
        return 'pi pi-check-circle';
      case 'PENDING':
        return 'pi pi-clock';
      case 'CANCELLED':
        return 'pi pi-times-cross';
      case 'FAILED':
        return 'pi pi-times';
      case 'DECLINED':
        return 'pi pi-ban';
      case 'EXPIRED':
        return 'pi pi-hourglass';
      default:
        return 'pi pi-clock';
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadTransactions(page);
  }

  showTransaction(transaction: Transaction) {
    this.isTransactionSummaryVisible = true;
    this.selectedTransaction = transaction;
  }
  hideTransaction() {
    this.isTransactionSummaryVisible = false;
    this.selectedTransaction = DEFAULT_TRANSACTION;
  }
}
