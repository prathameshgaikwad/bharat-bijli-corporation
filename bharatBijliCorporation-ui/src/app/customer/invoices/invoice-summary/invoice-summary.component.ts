import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  Invoice,
  defaultInvoice,
} from '../../../shared/types/consumables.types';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-invoice-summary',
  standalone: true,
  imports: [DatePipe, CommonModule, TagModule, ButtonModule, DividerModule],
  templateUrl: './invoice-summary.component.html',
  styleUrl: './invoice-summary.component.css',
})
export class InvoiceSummaryComponent implements OnInit {
  @Input() invoiceDetails: Invoice = defaultInvoice;
  isOverdue: boolean = false;
  billingAmount: number = 0;
  payBeforeDueDateDiscount: number = 0;
  totalAmount: number = 0;

  ngOnInit(): void {
    this.isOverdue = this.invoiceDetails.invoiceStatus === 'OVERDUE';
    this.billingAmount =
      this.invoiceDetails.tariff * this.invoiceDetails.unitsConsumed;

    const currentDate = new Date();
    const dueDate = new Date(this.invoiceDetails.dueDate);

    if (currentDate < dueDate) {
      this.payBeforeDueDateDiscount = this.billingAmount * 0.05; // 5% discount
    } else {
      this.payBeforeDueDateDiscount = 0; // No discount
    }
    this.totalAmount = this.billingAmount - this.payBeforeDueDateDiscount;
  }
}
