import { Component } from '@angular/core';
import { Customer } from '../../../shared/types/user.types';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { PaginatorModule } from 'primeng/paginator';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

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
  ],
  templateUrl: './view-customers.component.html',
  styleUrl: './view-customers.component.css'
})
export class ViewCustomersComponent {
  customer : Customer[] =[];
  messages: any = [];
  check = false;
  error: any = [];
  
  totalRecords: number = 0;
  rowsPerPage: number = 10;

}
