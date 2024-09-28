import { Component, OnInit } from '@angular/core';

import { CompanyLogoComponent } from '../../shared/components/company-logo/company-logo.component';
import { CustomerActionsMenuComponent } from '../customer-actions-menu/customer-actions-menu.component';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-customer-navbar',
  standalone: true,
  imports: [CompanyLogoComponent, TabMenuModule, CustomerActionsMenuComponent],
  templateUrl: './customer-navbar.component.html',
  styleUrl: './customer-navbar.component.css',
})
export class CustomerNavbarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
      {
        label: 'Your Bills',
        icon: 'pi pi-receipt',
      },
      {
        label: 'Payments',
        icon: 'pi pi-money-bill',
      },
    ];
  }
}
