import { Component, OnInit } from '@angular/core';
import { StatsComponent } from '../stats/stats.component';
import { ListingComponent } from '../../shared/components/listing/listing.component';
import { EmployeeService } from '../services/employee.service';
import { HttpClient } from '@angular/common/http';
import { Page, Transaction } from '../../shared/types/consumables.types';

@Component({
  selector: 'app-emp-dashboard',
  standalone: true,
  imports: [StatsComponent, ListingComponent],
  templateUrl: './emp-dashboard.component.html',
  styleUrl: './emp-dashboard.component.css',
})
export class EmpDashboardComponent implements OnInit {
  transactions : any[] =[] ;
  
  constructor(
    private empService: EmployeeService
  ) {}

  ngOnInit(): void {
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
}
