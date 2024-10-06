import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DEFAULT_TRANSACTION } from '../../../core/helpers/constants';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { Transaction } from '../../../shared/types/consumables.types';

@Component({
  selector: 'app-payment-summary',
  standalone: true,
  imports: [
    DialogModule,
    TagModule,
    CommonModule,
    DatePipe,
    DividerModule,
    ButtonModule,
    AccordionModule,
  ],
  templateUrl: './payment-summary.component.html',
  styleUrl: './payment-summary.component.css',
})
export class PaymentSummaryComponent {
  @Input({}) isVisible: boolean = false;
  @Input({}) isPaymentPageReferrer: boolean = false;
  @Input({}) transactionDetails: Transaction = DEFAULT_TRANSACTION;

  constructor(private router: Router) {}

  onClick() {
    this.router.navigate(['/customer/invoices']);
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
}
