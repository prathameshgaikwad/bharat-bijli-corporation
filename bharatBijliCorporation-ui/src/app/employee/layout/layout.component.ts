import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmpSidebarComponent } from '../emp-sidebar/emp-sidebar.component';
import { StatsComponent } from '../stats/stats.component';
import { CommonModule } from '@angular/common';
import { EmpDashboardComponent } from '../emp-dashboard/emp-dashboard.component';
import { CustomerNavbarComponent } from '../../customer/customer-navbar/customer-navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    EmpSidebarComponent,
    StatsComponent,
    CommonModule,
    EmpDashboardComponent,
    CustomerNavbarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
}
