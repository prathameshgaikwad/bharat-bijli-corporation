import { Component, OnInit } from '@angular/core';
import { StatsComponent } from '../stats/stats.component';
import { ListingComponent } from '../../shared/components/listing/listing.component';
import { EmployeeService } from '../services/employee.service';
import { HttpClient } from '@angular/common/http';
import { Page, Transaction } from '../../shared/types/consumables.types';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SortEvent } from 'primeng/api';
import { AppStateService } from '../../core/services/app-state.service';
import { Subscription } from 'rxjs';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emp-dashboard',
  standalone: true,
  imports: [
    StatsComponent,
    ListingComponent,
    PaginatorModule,
    ChipModule,
    TableModule,
    CommonModule
  ],
  templateUrl: './emp-dashboard.component.html',
  styleUrl: './emp-dashboard.component.css',
})
export class EmpDashboardComponent implements OnInit {
  customerId: string = '';
  username: string = '';
  transactions: any[] = [];
  private subscription!: Subscription;
  totalRecords: number = 44;
  rowsPerPage: number = 10;

  constructor(
    private empService: EmployeeService,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.subscription = this.appStateService
      .getUsername()
      .subscribe((username) => {
        this.username = username;
      });

    this.empService.getRecentTransactions().subscribe({
      next: (response: Page<Transaction>) => {
        console.log(response);

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
