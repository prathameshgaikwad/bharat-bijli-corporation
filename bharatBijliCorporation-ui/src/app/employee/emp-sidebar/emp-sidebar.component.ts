import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';

interface SidebarItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-emp-sidebar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, CommonModule, MenuModule,ToastModule],
  templateUrl: './emp-sidebar.component.html',
  styleUrl: './emp-sidebar.component.css'
})
export class EmpSidebarComponent {

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
        { label: 'Dashboard', icon: 'pi pi-home', route : 'dashboard' },
        { label: 'Customers', icon: 'pi pi-user', route : 'customer' },
        { label: 'Invoices', icon: 'pi pi-receipt', route : 'emp-invoices' },
        { label: 'Transactions', icon: 'pi pi-indian-rupee', route : 'transactions' },
        { label: 'PAY BY CASH', icon: 'pi pi-wallet' }
    ];
}
}
