import { Component } from '@angular/core';
import { CustomerNavbarComponent } from '../customer-navbar/customer-navbar.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CustomerNavbarComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class PaymentsComponent {}
