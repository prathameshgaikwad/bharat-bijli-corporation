import { Component } from '@angular/core';
import { CustomerNavbarComponent } from '../customer-navbar/customer-navbar.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CustomerNavbarComponent],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css',
})
export class CustomerDashboardComponent {}
