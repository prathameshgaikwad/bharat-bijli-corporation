import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Invoice,
  Page,
  defaultInvoice,
} from '../../shared/types/consumables.types';

import { AppStateService } from '../../core/services/app-state.service';
import { ButtonModule } from 'primeng/button';
import { CustomerService } from '../services/customer.service';
import { DialogModule } from 'primeng/dialog';
import { DynamicInvoiceMessage } from '../dynamic-invoice-message/dynamic-invoice-message.component';
import { InvoiceStatus } from '../../shared/types/enums.types';
import { InvoiceSummaryComponent } from './invoice-summary/invoice-summary.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    NavbarComponent,
    TableModule,
    DatePipe,
    CurrencyPipe,
    CommonModule,
    ButtonModule,
    TagModule,
    DynamicInvoiceMessage,
    DialogModule,
    InvoiceSummaryComponent,
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  customerId: string = '';
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  isBillGenerated: boolean = true;
  isOverdueAvailable: boolean = true;
  overDueInvoiceStatus: InvoiceStatus = InvoiceStatus.OVERDUE;
  pendingInvoiceStatus: InvoiceStatus = InvoiceStatus.PENDING;
  isInvoiceSummaryVisible: boolean = false;
  selectedInvoiceDetails: Invoice = defaultInvoice;

  constructor(
    private appStateService: AppStateService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.appStateService.getUserId().subscribe((userId) => {
      this.customerId = userId;
      this.loadInvoices();
    });
  }

  loadInvoices(page: number = this.currentPage): void {
    if (this.customerId) {
      this.customerService
        .getInvoices(this.customerId, page, this.pageSize)
        .subscribe({
          next: (response: Page<Invoice>) => {
            this.invoices = response.content;
            this.totalPages = response.totalPages;
          },
          error: (error) => {
            console.error('Error fetching invoices:', error);
          },
        });
    }
  }

  downloadPdf(customerId: string = this.customerId, invoiceId: string): void {
    this.customerService.downloadInvoicePdf(customerId, invoiceId).subscribe({
      next: (response: Blob) => {
        // Create a blob URL and open it
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${invoiceId}.pdf`; // Specify the file name
        a.click();
        window.URL.revokeObjectURL(url); // Clean up
      },
      error: (err) => {
        console.error('Error downloading PDF:', err);
      },
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PARTIALLY_PAID':
        return 'info';
      case 'PENDING':
        return 'warning';
      case 'OVERDUE':
        return 'danger';
      case 'VOID':
        return 'secondary';
      default:
        return 'contrast';
    }
  }

  getIcon(status: string) {
    switch (status) {
      case 'PAID':
        return 'pi pi-check-circle';
      case 'PARTIALLY_PAID':
        return 'pi pi-clock';
      case 'PENDING':
        return 'pi pi-clock';
      case 'OVERDUE':
        return 'pi pi-clock';
      case 'VOID':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-clock';
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadInvoices(page);
  }

  showInvoice(invoice: Invoice) {
    this.isInvoiceSummaryVisible = true;
    this.selectedInvoiceDetails = invoice;
  }
  hideInvoice() {
    this.isInvoiceSummaryVisible = false;
    this.selectedInvoiceDetails = defaultInvoice;
  }
}
