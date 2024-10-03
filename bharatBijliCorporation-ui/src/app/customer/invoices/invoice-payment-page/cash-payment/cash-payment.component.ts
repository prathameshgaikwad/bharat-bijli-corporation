import { Component, Input } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-cash-payment',
  standalone: true,
  imports: [DialogModule, DividerModule],
  templateUrl: './cash-payment.component.html',
  styleUrl: './cash-payment.component.css',
})
export class CashPaymentComponent {
  @Input({ required: true }) isVisible: boolean = false;
}
