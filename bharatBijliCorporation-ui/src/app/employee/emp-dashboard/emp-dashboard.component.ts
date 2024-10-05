import { AuthService, AuthState } from '../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Page, Transaction } from '../../shared/types/consumables.types';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { ListingComponent } from '../../shared/components/listing/listing.component';
import { StatsComponent } from '../stats/stats.component';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-emp-dashboard',
  standalone: true,
  imports: [
    StatsComponent,
    ListingComponent,
    PaginatorModule,
    ChipModule,
    TableModule,
    CommonModule,
  ],
  templateUrl: './emp-dashboard.component.html',
  styleUrl: './emp-dashboard.component.css',
})
export class EmpDashboardComponent implements OnInit {
  username: string = '';
  transactions: any[] = [];
  totalRecords: number = 44;
  rowsPerPage: number = 10;

  constructor(
    private empService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.empService
      .getEmployeeUsername(this.authService.getCurrentUserId())
      .subscribe({
        next: (response) => {
          this.username = response.username;
          const newState: AuthState = {
            username: response.username,
            ...this.authService.getAuthState(),
          };
          this.authService.updateAuthState(newState);
        },
        error: (err) => {
          console.error('Failed to fetch employee username:', err);
        },
      });

    this.empService.getRecentTransactions().subscribe({
      next: (response: Page<Transaction>) => {
        this.transactions = response.content;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'OVERDUE':
      case 'CANCELLED':
      case 'DECLINED':
      case 'FAILED':
        return 'red'; // Red for negative statuses
      case 'SUCCESS':
      case 'PAID':
        return 'green'; // Green for successful or paid
      case 'PENDING':
      case 'PARTIALLY_PAID':
        return 'orange'; // Orange for pending or partial payments
      case 'VOID':
      case 'EXPIRED':
        return 'grey'; // Grey for void or expired
      default:
        return 'black'; // Default color
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        return 'pi pi-check-circle'; // Success or Paid icon
      case 'CANCELLED':
      case 'DECLINED':
      case 'FAILED':
        return 'pi pi-exclamation-circle'; // Failure icons
      case 'PENDING':
      case 'PARTIALLY_PAID':
        return 'pi pi-hourglass'; // Pending or partially paid icon
      case 'OVERDUE':
        return 'pi pi-times-circle'; // Overdue icon
      case 'VOID':
        return 'pi pi-times-circle';
      case 'EXPIRED':
        return 'pi pi-ban'; // Void or expired icon
      default:
        return 'pi pi-info-circle'; // Default icon
    }
  }
}
