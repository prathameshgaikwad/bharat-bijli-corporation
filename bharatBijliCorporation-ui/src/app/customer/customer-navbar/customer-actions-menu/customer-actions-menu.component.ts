import { Component, OnInit } from '@angular/core';
import {
  ConfirmationService,
  MenuItem,
  MenuItemCommandEvent,
} from 'primeng/api';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-customer-actions-menu',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    RouterModule,
    MenuModule,
    ConfirmDialogModule,
  ],
  templateUrl: './customer-actions-menu.component.html',
  styleUrl: './customer-actions-menu.component.css',
  providers: [ConfirmationService],
})
export class CustomerActionsMenuComponent implements OnInit {
  balance: number = 1203.9;
  username: string = 'Prathamesh';

  items: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

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
        command: (event: MenuItemCommandEvent) => this.confirmLogout(event),
      },
    ];
  }

  confirmLogout(event: MenuItemCommandEvent) {
    this.confirmationService.confirm({
      target: event.originalEvent?.target as EventTarget,
      message: 'Do you really want to logout?',
      header: 'Confirm Logout',
      icon: 'pi pi-exclamation-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.onLogout();
      },
    });
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
