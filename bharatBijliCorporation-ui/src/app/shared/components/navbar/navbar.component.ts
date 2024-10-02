import { Component, OnInit } from '@angular/core';

import { ActionsMenuComponent } from './actions-menu/actions-menu.component';
import { AppStateService } from '../../../core/services/app-state.service';
import { CommonModule } from '@angular/common';
import { CompanyLogoComponent } from '../company-logo/company-logo.component';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CompanyLogoComponent,
    TabMenuModule,
    ActionsMenuComponent,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  isCustomer: boolean = false;

  constructor(private appStateService: AppStateService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/customer/dashboard',
      },
      {
        label: 'Bills',
        icon: 'pi pi-receipt',
        routerLink: '/customer/invoices',
      },
      {
        label: 'Payments',
        icon: 'pi pi-money-bill',
        routerLink: '/customer/payments',
      },
    ];

    this.appStateService.getRole().subscribe((role) => {
      this.isCustomer = role === 'CUSTOMER';
    });
  }
}
