import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmpDashboardComponent } from '../emp-dashboard/emp-dashboard.component';
import { EmpSidebarComponent } from '../emp-sidebar/emp-sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { StatsComponent } from '../stats/stats.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    EmpSidebarComponent,
    StatsComponent,
    CommonModule,
    EmpDashboardComponent,
    NavbarComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {}
