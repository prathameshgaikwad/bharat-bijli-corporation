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
import { MessageService, SortEvent } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

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
    MessagesModule,
    ToastModule
  ],
  templateUrl: './view-customers.component.html',
  styleUrl: './view-customers.component.css',
  providers: [MessageService],
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

  showConfirmBox = false

  constructor(
    private empService: EmployeeService,
    private messageService: MessageService
  ) {}

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
          this.searchQuery = '';
          this.error = [
            {
              severity: 'error',
              summary: error.error.message,
            },
          ];
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
    this.loadCustomers();
    if (this.searchQuery == '') {
      this.messages = [{ severity: 'warn', detail: 'Search field empty' }];
    }
    return;
  }

  showBox = false;
  selectedCustomerDetails: Customer = defaultCustomer;
  showCustomer() {
    this.showBox = true;
  }

  hideCustomer() {
    this.showBox = false;
    if(!this.showConfirmBox)
        this.selectedCustomerDetails = defaultCustomer;
    this.loadCustomers();
  }

  saveCustomerDetails() {
    this.showConfirmBox = true;
    this.showBox = false; 
  }

  updateCustomerDetails(){
    if (this.selectedCustomerDetails) {
      this.empService.updateCustomer(this.selectedCustomerDetails).subscribe({
        next: (response) => {
          if(response.error){
            this.messageService.add({
              severity: 'warn',
              summary: 'Updation Failed',
              detail:
                `Identical details were submitted` +
                ` for ` +
                this.selectedCustomerDetails.id
            });
            this.showConfirmBox = false
            return
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Updation Failed',
            detail:
              `Updation Succesful` +
              ` for ` +
              this.selectedCustomerDetails.id
          });
          this.showConfirmBox = false;
        },
        error: (error) => {
          console.error('Error updating customer:', error);
          this.messageService.add({
            severity:'error',
            summary:error
          })
          this.showConfirmBox = false;
        },
      });
    }
  }
}
