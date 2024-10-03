import { Component, Input } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-cash-payment',
  standalone: true,
  imports: [DialogModule, DividerModule, PanelModule, FieldsetModule],
  templateUrl: './cash-payment.component.html',
  styleUrl: './cash-payment.component.css',
})
export class CashPaymentComponent {
  @Input({ required: true }) isVisible: boolean = false;
}
