import { Component, ViewChild, viewChild } from '@angular/core';
import {
  Customer,
  defaultCustomer,
  defaultPersonalDetails,
  PersonalDetails,
} from '../../../shared/types/user.types';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { PaginatorModule } from 'primeng/paginator';
import { ChipModule } from 'primeng/chip';
import { CommonModule, JsonPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { EmployeeService } from '../../services/employee.service';
import { SortEvent } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-customers',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ChipModule,
    PaginatorModule,
    InputGroupModule,
    ButtonModule,
    InputTextModule,
    InputGroupAddonModule,
    DialogModule,
  ],
  templateUrl: './view-customers.component.html',
  styleUrl: './view-customers.component.css',
})
export class ViewCustomersComponent {
  customers: Customer[] = [];
  messages: any = [];
  check = false;
  error: any = [];

  totalRecords: number = 0;
  rowsPerPage: number = 10;

  first = 0;
  sortField: string = '';
  sortOrder: string = '';
  previousSortField: string = ''; // Track previous sort field
  previousSortOrder: string = 'asc'; // Track previous sort order
  searchQuery = '';

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.empService.getCountOfCustomers().subscribe({
      next: (response: number) => {
        this.totalRecords = response;
      },
      error: (err) => {
        console.error('Request Failed : ', err);
      },
    });
    this.loadCustomers();
  }

  loadCustomers() {
    this.empService
      .getPaginatedCustomers(
        this.first / this.rowsPerPage,
        this.rowsPerPage,
        this.sortField,
        this.sortOrder,
        this.searchQuery
      )
      .subscribe({
        next: (response) => {
          this.customers = response.content;
          this.totalRecords = response.totalElements; 
        },
        error: (error) => {
          console.error('Error fetching customers :', error);
          this.error = [{ severity: 'error', detail: 'Invalid Req' }];
          this.searchQuery = "";
        },
      });
  }

  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.rowsPerPage = event.rows ?? 10;
    this.loadCustomers();
  }

  onSort(event: SortEvent) {
    const newSortField = event.field ?? '';
    const newSortOrder = event.order === 1 ? 'asc' : 'desc';

    if (
      newSortField !== this.previousSortField ||
      newSortOrder !== this.previousSortOrder
    ) {
      this.sortField = newSortField;
      this.sortOrder = newSortOrder;
      this.previousSortField = this.sortField;
      this.previousSortOrder = this.sortOrder;
      this.loadCustomers();
    }
  }

  onSearch() {
    this.first = 0;
    const prevrec = this.customers;
    this.loadCustomers();
    if (this.searchQuery == '') {
      this.messages = [{ severity: 'warn', detail: 'Enter' }];
    }
  }

  showBox = false;
  selectedCustomerDetails: Customer = defaultCustomer;
  showCustomer(customer: Customer) {
    this.selectedCustomerDetails = customer;
    this.showBox = true;
  }

  hideCustomer() {
    this.showBox = false;
    this.selectedCustomerDetails = defaultCustomer;
    this.loadCustomers();
  }

  saveCustomerDetails() {
    if (this.selectedCustomerDetails) {
      this.empService.updateCustomer(this.selectedCustomerDetails).subscribe({
        next: (response) => {
          console.log('Customer updated successfully', response);
          this.showBox = false; // Close the dialog after saving
          this.loadCustomers(); // Reload the customer list to reflect the changes
        },
        error: (error) => {
          console.error('Error updating customer:', error);
        },
      });
    }
  }
}
