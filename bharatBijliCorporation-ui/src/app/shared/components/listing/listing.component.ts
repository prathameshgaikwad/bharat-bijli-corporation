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
    // Set total records to the length of the data array passed from parent
    this.totalRecords = this.data.length;

    // Load the first page of data initially
    this.loadData({ first: 0, rows: this.rows });
  }

  // Simulate lazy loading/pagination for data
  loadData(event: any) {
    this.loading = true;

    // Calculate start and end indices for slicing
    const start = event.first;
    const end = start + event.rows;
    this.loading = false;
  }
}
