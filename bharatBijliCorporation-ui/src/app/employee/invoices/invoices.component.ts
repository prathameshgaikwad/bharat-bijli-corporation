import { Component } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { PaginatorModule } from 'primeng/paginator';
import { SortEvent } from 'primeng/api';
import {
  defaultInvoice,
  Invoice,
  Page,
  Transaction,
} from '../../shared/types/consumables.types';
import { MessagesModule } from 'primeng/messages';
import { DynamicInvoiceMessage } from '../../customer/dynamic-invoice-message/dynamic-invoice-message.component';
import { InvoiceSummaryComponent } from '../../customer/invoices/invoice-summary/invoice-summary.component';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InvoiceStatus } from '../../shared/types/enums.types';

@Component({
  selector: 'app-invoices',
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
    RouterLink,
    DynamicInvoiceMessage,
    InvoiceSummaryComponent,
    DialogModule,
    InvoiceSummaryComponent,
    DividerModule,
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class EmpInvoicesComponent {
  invoices: any[] = [];
  messages: any = [];
  check = false;
  error: any = [];

  totalRecords: number = 0;
  rowsPerPage: number = 10;

  rows = this.invoices.length;
  first = 0;
  sortField: string = '';
  sortOrder: string = '';
  previousSortField: string = ''; // Track previous sort field
  previousSortOrder: string = 'asc'; // Track previous sort order
  searchQuery = '';

  selectedInvoiceDetails: Invoice = defaultInvoice;
  showBox = false;

  constructor(
    private invoiceService: EmployeeService,
    private router: Router
  ) {}

  navigateToAddInvoice() {
    this.router.navigate(['/employee/emp-invoices/add']);
  }

  ngOnInit(): void {
    this.invoiceService.getCountOfInvoices().subscribe({
      next: (response: number) => {
        this.totalRecords = response;
      },
      error: (err) => {
        console.error('Request Failed : ', err);
      },
    });
    this.loadInvoices();
  }

  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.rowsPerPage = event.rows ?? 10;
    this.loadInvoices();
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
      this.loadInvoices();
    }
  }

  onSearch() {
    this.first = 0;
    const prevrec = this.invoices;
    this.loadInvoices();
    if (this.searchQuery == '') {
      this.messages = [{ severity: 'warn', detail: 'Enter' }];
    }
  }

  loadInvoices() {
    this.invoiceService
      .getPaginatedInvoices(
        this.first / this.rowsPerPage,
        this.rowsPerPage,
        this.sortField,
        this.sortOrder,
        this.searchQuery
      )
      .subscribe({
        next: (response: Page<Invoice>) => {
          this.invoices = response.content;
          this.totalRecords = response.totalElements;
        },
        error: (error) => {
          this.error = [{ severity: 'error', detail: 'Invalid Req' }];
        },
      });
  }

  showInvoice(invoice: Invoice) {
    this.selectedInvoiceDetails = invoice;
    console.log(new Date(), new Date(this.selectedInvoiceDetails.dueDate));

    if (this.selectedInvoiceDetails.invoiceStatus == 'PAID') {
      this.isPaid = true;
    } else if (
      this.selectedInvoiceDetails.invoiceStatus == InvoiceStatus.OVERDUE ||
      new Date(this.selectedInvoiceDetails.dueDate) < new Date()
    ) {
      this.isOverdue = true;
    } else {
      this.isOverdue = false;
      this.isPaid = false;
      console.log("No OverDue");
      
    }
    this.calculateInvoiceDetails();
    this.showBox = true;
  }

  isOverdue: boolean = false;
  billingAmount: number = 0;
  payBeforeDueDateDiscount: number = 0;
  totalAmount: number = 0;
  isPaid = false;
  paidAt: Date = new Date();

  toggle() {
    this.isPaid = false;
    this.showBox = false;
    this.selectedInvoiceDetails = defaultInvoice;
  }

  private calculateInvoiceDetails() {
    if (this.isPaid) {
      this.invoiceService
        .getPaidTransactionByInvoice(this.selectedInvoiceDetails)
        .subscribe({
          next: (response: Transaction) => {
            this.totalAmount = response.amount;
            this.paidAt = response.createdAt;
          },
        });
      return;
    }
    this.billingAmount =
      this.selectedInvoiceDetails.tariff *
      this.selectedInvoiceDetails.unitsConsumed;

    const currentDate = new Date();
    const dueDate = new Date(this.selectedInvoiceDetails.dueDate);

    if (currentDate < dueDate) {
      this.payBeforeDueDateDiscount = this.billingAmount * 0.05; // 5% discount
    } else {
      this.payBeforeDueDateDiscount = 0; // No discount
    }
    this.totalAmount = this.billingAmount - this.payBeforeDueDateDiscount;
    console.log(this.isOverdue);
    
  }

  hideInvoice() {
    this.selectedInvoiceDetails = defaultInvoice;
    this.isPaid = false;
    this.showBox = false;
    console.log(this.isPaid);
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
