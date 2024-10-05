import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DynamicInvoiceMessage } from '../../dynamic-invoice-message/dynamic-invoice-message.component';
import { InvoiceStatus } from '../../../shared/types/enums.types';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-actions-panel',
  standalone: true,
  imports: [DynamicInvoiceMessage, PanelModule, CommonModule],
  templateUrl: './actions-panel.component.html',
  styleUrl: './actions-panel.component.css',
})
export class ActionsPanelComponent {
  @Input({ required: true }) isActionRequired!: boolean;
  @Input({ required: true }) isPendingBill!: boolean;
  @Input({ required: true }) isOverdueBill!: boolean;
  @Output() pendingInvoicesChecked = new EventEmitter<boolean>();
  @Output() overdueInvoicesChecked = new EventEmitter<boolean>();
  overDueInvoiceStatus: InvoiceStatus = InvoiceStatus.OVERDUE;
  pendingInvoiceStatus: InvoiceStatus = InvoiceStatus.PENDING;

  constructor() {}

  // onInvoicesPresenceChecked(hasInvoices: boolean): void {
  //   alert('Checked invoices');
  //   if (hasInvoices) {
  //     this.isActionRequired = true;
  //   }
  // }
}
