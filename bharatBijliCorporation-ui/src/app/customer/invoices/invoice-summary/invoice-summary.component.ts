import {
  BillingDetails,
  Invoice,
} from '../../../shared/types/consumables.types';
import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  DEFAULT_BILLING_DETAILS,
  DEFAULT_INVOICE,
} from '../../../core/helpers/constants';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { calculateInvoiceDetails } from '../../../core/helpers/invoice';

@Component({
  selector: 'app-invoice-summary',
  standalone: true,
  imports: [DatePipe, CommonModule, TagModule, ButtonModule, DividerModule],
  templateUrl: './invoice-summary.component.html',
  styleUrl: './invoice-summary.component.css',
})
export class InvoiceSummaryComponent implements OnInit, OnChanges {
  @Input() invoiceDetails: Invoice = DEFAULT_INVOICE;
  isOverdue: boolean = false;
  billingAmount: number = 0;
  payBeforeDueDateDiscount: number = 0;
  totalAmount: number = 0;
  isBillPayable: boolean = true;
  isLoading: boolean = false;
  calculatedBillingDetails: BillingDetails = DEFAULT_BILLING_DETAILS;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.calculatedBillingDetails = calculateInvoiceDetails(
      this.invoiceDetails
    );
    this.setBillingDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isLoading = true;
    if (changes['invoiceDetails']) {
      this.calculatedBillingDetails = calculateInvoiceDetails(
        this.invoiceDetails
      );
      this.setBillingDetails();
      this.setElementStates();
    }
    this.isLoading = false;
  }

  private setBillingDetails() {
    this.billingAmount = this.calculatedBillingDetails.billingAmount;
    this.payBeforeDueDateDiscount =
      this.calculatedBillingDetails.payBeforeDueDateDiscount;
    this.totalAmount = this.calculatedBillingDetails.totalAmount;
  }

  setElementStates() {
    if (
      this.invoiceDetails.invoiceStatus === 'VOID' ||
      this.invoiceDetails.invoiceStatus === 'PAID'
    ) {
      this.isBillPayable = false;
    } else {
      this.isBillPayable = true;
    }

    this.isOverdue = this.invoiceDetails.invoiceStatus === 'OVERDUE';
  }

  onPayClick() {
    this.router.navigate([
      `/customer/invoices/${this.invoiceDetails.id}/payment`,
    ]);
  }
}
