import { Component } from '@angular/core';
import { StatsComponent } from '../stats/stats.component';
import { ListingComponent } from '../../shared/components/listing/listing.component';

@Component({
  selector: 'app-emp-dashboard',
  standalone: true,
  imports: [StatsComponent, ListingComponent],
  templateUrl: './emp-dashboard.component.html',
  styleUrl: './emp-dashboard.component.css'
})
export class EmpDashboardComponent {
  transactions = [
    {
      customer: 'John Doe', // Assuming the Customer model has a 'name' property
      amount: 150.00,
      transactionMethod: 'CREDIT_CARD', // Adjust according to your enums
      transactionStatus: 'PENDING', // Adjust according to your enums
      createdAt: '2024-09-29T12:34:56' // Adjust as per LocalDateTime format
    }
    ,{
      customer: 'John Doe', // Assuming the Customer model has a 'name' property
      amount: 150.00,
      transactionMethod: 'CREDIT_CARD', // Adjust according to your enums
      transactionStatus: 'COMPLETED', // Adjust according to your enums
      createdAt: '2024-09-29T12:34:56' // Adjust as per LocalDateTime format
    }
    ,{
      customer: 'John Doe', // Assuming the Customer model has a 'name' property
      amount: 150.00,
      transactionMethod: 'CREDIT_CARD', // Adjust according to your enums
      transactionStatus: 'COMPLETED', // Adjust according to your enums
      createdAt: '2024-09-29T12:34:56' // Adjust as per LocalDateTime format
    }
    ,{
      customer: 'John Doe', // Assuming the Customer model has a 'name' property
      amount: 150.00,
      transactionMethod: 'CREDIT_CARD', // Adjust according to your enums
      transactionStatus: 'COMPLETED', // Adjust according to your enums
      createdAt: '2024-09-29T12:34:56' // Adjust as per LocalDateTime format
    }
    ,{
      customer: 'John Doe', // Assuming the Customer model has a 'name' property
      amount: 150.00,
      transactionMethod: 'CREDIT_CARD', // Adjust according to your enums
      transactionStatus: 'COMPLETED', // Adjust according to your enums
      createdAt: '2024-09-29T12:34:56' // Adjust as per LocalDateTime format
    }
    
  ];
}
