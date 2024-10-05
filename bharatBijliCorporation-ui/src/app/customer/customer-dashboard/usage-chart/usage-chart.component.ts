import { Component, Input, OnInit } from '@angular/core';
import { getShortMonth, getShortYear } from '../../../core/helpers/string';

import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { DividerModule } from 'primeng/divider';
import { MonthlyUsageDetails } from '../../../shared/types/consumables.types';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-usage-chart',
  standalone: true,
  imports: [ChartModule, PanelModule, CommonModule, DividerModule],
  templateUrl: './usage-chart.component.html',
  styleUrl: './usage-chart.component.css',
})
export class UsageChartComponent implements OnInit {
  @Input({ required: true }) customerId: string;
  monthlyUsageData: MonthlyUsageDetails[];
  monthlyConsumptionChange: number = 0;
  yearlyConsumptionChange: number = 0;
  chartData: any;
  chartOptions: any;
  DEFAULT_COUNT: number = 6;

  constructor(private customerService: CustomerService) {
    this.customerId = '';
    this.monthlyUsageData = [];
  }

  ngOnInit(): void {
    this.customerService
      .getMonthlyUsageData(this.customerId)
      .subscribe((data) => {
        this.monthlyUsageData = data;
        this.calculateConsumptionMetrics(data);
        this.chartData = {
          labels: this.monthlyUsageData
            .slice(this.DEFAULT_COUNT)
            .map(
              (entry) =>
                `${getShortMonth(entry.month)} ${getShortYear(entry.year)}`
            ),
          datasets: [
            {
              legend: 'Monthly Consumption',
              data: this.monthlyUsageData
                .slice(this.DEFAULT_COUNT)
                .map((entry) => entry.unitsConsumed),
              fill: true,
              borderColor: '#3B82F6',
              tension: 0.4,
              backgroundColor: 'rgba(59, 130, 246,0.2)',
            },
          ],
        };
        this.chartOptions = {
          responsive: true,
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                display: true,
              },
            },
            y: {
              grid: {
                display: false,
              },
              ticks: {
                display: true,
                maxTicksLimit: 5,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        };
      });
  }

  calculateConsumptionMetrics(data: MonthlyUsageDetails[]): void {
    if (data.length > 1) {
      const latestMonth = data[data.length - 1].unitsConsumed;
      const previousMonth = data[data.length - 2].unitsConsumed;
      const yearAgoMonth = data[0].unitsConsumed;

      if (previousMonth === 0) {
        this.monthlyConsumptionChange = latestMonth > 0 ? 0 : 0; // Use null to indicate infinity
      } else {
        this.monthlyConsumptionChange =
          (latestMonth - previousMonth) / previousMonth;
      }

      if (yearAgoMonth === 0) {
        this.yearlyConsumptionChange = latestMonth > 0 ? 0 : 0;
      } else {
        this.yearlyConsumptionChange =
          (latestMonth - yearAgoMonth) / yearAgoMonth;
      }
    } else {
      this.monthlyConsumptionChange = 0;
      this.yearlyConsumptionChange = 0;
    }
  }
}
