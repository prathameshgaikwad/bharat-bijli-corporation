import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DynamicInvoiceMessage } from '../../dynamic-invoice-message/dynamic-invoice-message.component';
import { InvoiceStatus } from '../../../shared/types/enums.types';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-actions-panel',
  standalone: true,
  imports: [DynamicInvoiceMessage, PanelModule, CommonModule, ButtonModule],
  templateUrl: './actions-panel.component.html',
  styleUrl: './actions-panel.component.css',
})
export class ActionsPanelComponent {
  @Input({ required: true }) isActionRequired!: boolean;
  @Input({ required: true }) isPendingBill!: boolean;
  @Input({ required: true }) isOverdueBill!: boolean;
  @Input({ required: true }) walletBalance: number = 0;
  @Output() pendingInvoicesChecked = new EventEmitter<boolean>();
  @Output() overdueInvoicesChecked = new EventEmitter<boolean>();
  overDueInvoiceStatus: InvoiceStatus = InvoiceStatus.OVERDUE;
  pendingInvoiceStatus: InvoiceStatus = InvoiceStatus.PENDING;

  constructor() {}
}
