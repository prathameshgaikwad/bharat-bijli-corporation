import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Invoice, Page } from '../../shared/types/consumables.types';

import { AppStateService } from '../../core/services/app-state.service';
import { ButtonModule } from 'primeng/button';
import { CustomerService } from '../services/customer.service';
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
}
