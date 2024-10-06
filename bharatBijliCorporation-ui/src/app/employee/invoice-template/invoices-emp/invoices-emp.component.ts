import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { PaginatorModule } from 'primeng/paginator';
import { SortEvent } from 'primeng/api';

import { MessagesModule } from 'primeng/messages';
import { DynamicInvoiceMessage } from '../../../customer/dynamic-invoice-message/dynamic-invoice-message.component';
import { InvoiceSummaryComponent } from '../../../customer/invoices/invoice-summary/invoice-summary.component';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import {
  InvoiceStatus,
  TransactionMethod,
} from '../../../shared/types/enums.types';
import {
  BillingDetails,
  Invoice,
  Page,
  RecordPaymentRequest,
} from '../../../shared/types/consumables.types';
import {
  DEFAULT_BILLING_DETAILS,
  DEFAULT_INVOICE,
} from '../../../core/helpers/constants';
import { calculateInvoiceDetails } from '../../../core/helpers/invoice';
import { Customer, defaultCustomer } from '../../../shared/types/user.types';

export interface InvoiceForPayment {
  customer: Customer;
  unitsConsumed: number;
  tariff: number;
  periodStartDate: Date;
  periodEndDate: Date;
  dueDate: Date;
  invoiceStatus: InvoiceStatus;
}

export const DEFAULT_INVOICE_PAY_RESPONSE: InvoiceForPayment = {
  customer: defaultCustomer,
  unitsConsumed: 0,
  tariff: 0,
  periodStartDate: new Date(),
  periodEndDate: new Date(),
  dueDate: new Date(),
  invoiceStatus: InvoiceStatus.PENDING,
};

@Component({
  selector: 'app-invoices-emp',
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
  templateUrl: './invoices-emp.component.html',
  styleUrl: './invoices-emp.component.css',
})
export class EmpInvoicesComponent {
  invoices: any[] = [];
  messages: any = [];
  check = false;
  error: any = [];

  totalRecords: number = 0;
  rowsPerPage: number = 10;

  // rows = this.invoices.length;
  first = 0;
  sortField: string = '';
  sortOrder: string = '';
  previousSortField: string = ''; // Track previous sort field
  previousSortOrder: string = 'asc'; // Track previous sort order
  searchQuery = '';

  selectedInvoiceDetails: Invoice = DEFAULT_INVOICE;
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
        next: (response) => {
          this.invoices = response.content;
          this.totalRecords = response.totalElements
        },
        error: (error) => {
          console.log(error);
          this.error = [{ severity: 'error', detail: 'Invalid Req' }];
          this.searchQuery = "";
        },
      });
  }

  isOverdue: boolean = false;
  billingAmount: number = 0;
  payBeforeDueDateDiscount: number = 0;
  totalAmount: number = 0;
  isPaid = false;
  paidAt: Date = new Date();
  calculatedBillingDetails: BillingDetails = DEFAULT_BILLING_DETAILS;
  customerId = '';
  invoiceToPay: InvoiceForPayment = DEFAULT_INVOICE_PAY_RESPONSE;

  showInvoice(invoice: any) {
    console.log(invoice);
    
    this.invoiceToPay = invoice;
    this.selectedInvoiceDetails = invoice;
    this.selectedInvoiceDetails.customerId = this.invoiceToPay.customer.id;
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
    }
    this.calculateInvoiceDetails();
    this.showBox = true;
  }

  private calculateInvoiceDetails() {
    this.calculatedBillingDetails = calculateInvoiceDetails(
      this.selectedInvoiceDetails
    );

    this.billingAmount = this.calculatedBillingDetails.billingAmount;
    this.payBeforeDueDateDiscount =
      this.calculatedBillingDetails.payBeforeDueDateDiscount;
    this.totalAmount = this.calculatedBillingDetails.totalAmount;
  }

  hideInvoice() {
    this.selectedInvoiceDetails = DEFAULT_INVOICE;
    this.isPaid = false;
    this.showBox = false;
    console.log(this.isPaid);
  }

  onPayClick() {
    const paymentRequest: RecordPaymentRequest = {
      customerId: this.selectedInvoiceDetails.customerId,
      invoiceId: this.selectedInvoiceDetails.id,
      paymentMethod: TransactionMethod.CASH,
      totalAmount: this.billingAmount,
      transactionDate: new Date(),
      transactionReference: `TXNREF${this.selectedInvoiceDetails.customerId}INV${this.selectedInvoiceDetails.id}`,
      discountByDueDate: this.payBeforeDueDateDiscount,
      discountByOnlinePayment: 0,
      paymentDescription: `Paid by Cash`,
    };
    console.log(this.selectedInvoiceDetails);

    this.invoiceService.addCashPayment(paymentRequest).subscribe({
      next: (response) => {
        console.log('Success');
        this.loadInvoices();
        this.showBox = false;
      },
    });
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
