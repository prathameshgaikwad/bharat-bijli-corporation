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
  // = [
  //   {
  //     customer: 'John Doe', // Assuming the Customer model has a 'name' property
  //     amount: 150.0,
  //     transactionMethod: 'CREDIT_CARD', // Adjust according to your enums
  //     transactionStatus: 'PENDING', // Adjust according to your enums
  //     createdAt: '2024-09-29T12:34:56', // Adjust as per LocalDateTime format
  //     hola: 'amigos',
  //   },
  //   {
  //     customer: 'John Doe', // Assuming the Customer model has a 'name' property
  //     amount: 150.0,
  //     transactionMethod: 'CREDIT_CARD', // Adjust according to your enums
  //     transactionStatus: 'COMPLETED', // Adjust according to your enums
  //     createdAt: '2024-09-29T12:34:56', // Adjust as per LocalDateTime format
  //     hola: 'amigos',
  //   },
  //   {
  //     customer: 'John Doe', // Assuming the Customer model has a 'name' property
  //     amount: 150.0,
  //     transactionMethod: 'CREDIT_CARD', // Adjust according to your enums
  //     transactionStatus: 'COMPLETED', // Adjust according to your enums
  //     createdAt: '2024-09-29T12:34:56', // Adjust as per LocalDateTime format
  //     hola: 'amigos',
  //   },
  //   {
  //     customer: 'John Doe', // Assuming the Customer model has a 'name' property
  //     amount: 150.0,
  //     transactionMethod: 'CREDIT_CARD', // Adjust according to your enums
  //     transactionStatus: 'COMPLETED', // Adjust according to your enums
  //     createdAt: '2024-09-29T12:34:56', // Adjust as per LocalDateTime format
  //     hola: 'amigos',
  //   },
  //   {
  //     customer: 'John Doe', // Assuming the Customer model has a 'name' property
  //     amount: 150.0,
  //     transactionMethod: 'CREDIT_CARD', // Adjust according to your enums
  //     transactionStatus: 'COMPLETED', // Adjust according to your enums
  //     createdAt: '2024-09-29T12:34:56', // Adjust as per LocalDateTime format
  //     hola: 'amigos',
  //   },
  // ];

  constructor(
    private empService: EmployeeService,
    private httpclient: HttpClient
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
