import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [TableModule, CommonModule, ChipModule],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.css',
})
export class ListingComponent {
  @Input() data: any[] = []; // Dynamic data passed from the parent component
  @Input() headers: any[] = []; // Dynamic table headers passed from parent
  @Input() fields: any[] = []; // Fields to be displayed in the table body

  rows = 10; // Number of records per page
  totalRecords: number = 0;
  loading: boolean = false;

  ngOnInit() {
    this.totalRecords = this.data.length;
    this.loadData({ first: 0, rows: this.rows });
  }

  loadData(event: any) {
    this.loading = true;
    const start = event.first;
    const end = start + event.rows;
    this.loading = false;
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
      case 'EXPIRED':
        return 'pi pi-ban'; // Void or expired icon
      default:
        return 'pi pi-info-circle'; // Default icon
    }
  }

}
