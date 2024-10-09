import { Component } from '@angular/core';
import { StatsComponent } from '../stats/stats.component';
import { ListingComponent } from '../../shared/components/listing/listing.component';
import { EmployeeService } from '../services/employee.service';
import { HttpClient } from '@angular/common/http';
import { Page, Transaction } from '../../shared/types/consumables.types';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MessageService, SortEvent } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessagesModule } from 'primeng/messages';
import { PaymentSummaryComponent } from '../../customer/payments/payment-summary/payment-summary.component';
import { DEFAULT_TRANSACTION } from '../../core/helpers/constants';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ChipModule,
    PaginatorModule,
    InputGroupModule,
    ButtonModule,
    InputTextModule,
    InputGroupAddonModule,
    MessagesModule,
    PaymentSummaryComponent,
    ToastModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  providers: [MessageService],
})
export class TransactionsComponent {
  transactions: Transaction[] = [];
  totalRecords: number = 0;
  rowsPerPage: number = 10;

  messages: any = [];
  check = false;

  rows = this.transactions.length;
  first = 0;
  sortField: string = '';
  sortOrder: string = '';
  previousSortField: string = ''; // Track previous sort field
  previousSortOrder: string = 'asc'; // Track previous sort order
  searchQuery = '';

  
  selectedTransaction : Transaction = DEFAULT_TRANSACTION;
  isTransactionSummaryVisible: boolean = false;

  constructor(private empService: EmployeeService,
    private messageService : MessageService) {}

  ngOnInit(): void {
    this.empService.getCountOfTransaction().subscribe({
      next: (response: number) => {
        this.totalRecords = response;
      },
      error: (err) => {
        console.error('Request Failed : ', err);
      },
    });
    this.loadTransactions();
  }

  loadTransactions() {
    this.empService
      .getPaginatedTransactions(
        this.first / this.rowsPerPage,
        this.rowsPerPage,
        this.sortField,
        this.sortOrder,
        this.searchQuery
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity:'success',
            summary:response.message
          })
          this.transactions = response.data.content;
          this.totalRecords = response.data.totalElements;
        },
        error: (error) => {
          this.messageService.add({
            severity:'error',
            summary:error.message
          })
        },
      });
  }

  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.rowsPerPage = event.rows ?? 10;
    this.loadTransactions();
  }

  onSort(event: SortEvent) {
    const newSortField = event.field ?? '';
    const newSortOrder = event.order === 1 ? 'asc' : 'desc';

    if (
      newSortField !== this.previousSortField ||
      newSortOrder !== this.previousSortOrder
    ) {
      this.sortField = newSortField;
      this.sortOrder = newSortOrder;
      this.previousSortField = this.sortField;
      this.previousSortOrder = this.sortOrder;
      this.loadTransactions();
    }
  }

  onSearch() {
    this.first = 0;
    const prevrec = this.transactions;
    this.loadTransactions();
    if(this.searchQuery==''){
      this.messages = [{ severity: 'warn', detail: 'Enter' }];
    }
  }

  showTransaction(transaction: any) {
    this.isTransactionSummaryVisible = true;
    this.selectedTransaction = transaction;
  }

  hideTransaction() {
    this.selectedTransaction = DEFAULT_TRANSACTION;
    this.isTransactionSummaryVisible = false;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'OVERDUE':
      case 'CANCELLED':
      case 'DECLINED':
      case 'FAILED':
        return 'red'; // Red for negative statuses
      case 'SUCCESS':
      case 'PAID':
        return 'green'; // Green for successful or paid
      case 'PENDING':
      case 'PARTIALLY_PAID':
        return 'orange'; // Orange for pending or partial payments
      case 'VOID':
      case 'EXPIRED':
        return 'grey'; // Grey for void or expired
      default:
        return 'black'; // Default color
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        return 'pi pi-check-circle'; // Success or Paid icon
      case 'CANCELLED':
      case 'DECLINED':
      case 'FAILED':
        return 'pi pi-exclamation-circle'; // Failure icons
      case 'PENDING':
      case 'PARTIALLY_PAID':
        return 'pi pi-hourglass'; // Pending or partially paid icon
      case 'OVERDUE':
        return 'pi pi-times-circle'; // Overdue icon
      case 'VOID':
        return 'pi pi-times-circle';
      case 'EXPIRED':
        return 'pi pi-ban'; // Void or expired icon
      default:
        return 'pi pi-info-circle'; // Default icon
    }
  }
}
