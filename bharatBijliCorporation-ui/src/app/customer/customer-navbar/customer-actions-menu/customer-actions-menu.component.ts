import { Component, OnInit } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-actions-menu',
  standalone: true,
  imports: [AvatarModule, ButtonModule, RouterModule, MenuModule],
  templateUrl: './customer-actions-menu.component.html',
  styleUrl: './customer-actions-menu.component.css',
})
export class CustomerActionsMenuComponent implements OnInit {
  balance: number = 1203.9;
  username: string = 'Prathamesh';

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
      },
      {
        label: 'Payment Methods',
        icon: 'pi pi-wallet',
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
      },
    ];
  }
}
