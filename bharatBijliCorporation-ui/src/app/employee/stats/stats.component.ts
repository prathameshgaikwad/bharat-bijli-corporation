import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [RouterLink, CommonModule, CardModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit{
constructor(private empService : EmployeeService){}

custCount = 0;
transactionCount = 0;
invoicesCount = 0;
pendingCount = 0;

ngOnInit(): void {
      this.empService.getCountOfTransaction().subscribe({
        next:(response : number) => {
          this.transactionCount = response;
        },
        error:(err) =>{
          console.error('Request Failed : ', err);
        }
      });
    
      this.empService.getCountOfInvoices().subscribe({
        next: (response: number) => {
          this.invoicesCount = response;
        },
        error: (err) => {
          console.error('Request Failed (Invoices Count):', err);
        }
      });
    
      this.empService.getCountOfPendingTransactions().subscribe({
        next: (response: number) => {
          this.pendingCount = response;
        },
        error: (err) => {
          console.error('Request Failed (Pending Transactions Count):', err);
        }
      });

      this.empService.getCountOfCustomers().subscribe({
        next: (response: number) => {
          this.custCount = response;
        },
        error: (err) => {
          console.error('Request Failed (Customers Count):', err);
        }
      });
}

}
