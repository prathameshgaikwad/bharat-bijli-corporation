import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConfirmationService,
  MenuItem,
  MenuItemCommandEvent,
} from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AppStateService } from '../../../core/services/app-state.service';
import { AuthService } from '../../../core/services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CustomerService } from '../../services/customer.service';
import { EmployeeService } from '../../../employee/services/employee.service';
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
export class CustomerActionsMenuComponent implements OnInit, OnDestroy {
  username: string = '';
  userId: string = '';
  role: string = 'GUEST';
  private destroy$ = new Subject<void>();

  items: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private appStateService: AppStateService,
    private customerService: CustomerService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    console.log('Navbar');

    this.appStateService
      .getUserId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userId) => {
        if (userId) {
          this.userId = userId;
          this.appStateService
            .getRole()
            .pipe(takeUntil(this.destroy$))
            .subscribe((role) => {
              this.role = role;
            });
          if (this.role === 'CUSTOMER') {
            this.fetchCustomerUsername(userId);
          } else {
            this.fetchEmployeeUsername(userId);
          }
        }
      });

    const customerActionsMenu: MenuItem[] = [
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

    const employeeActionsMenu: MenuItem[] = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
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

    this.items =
      this.role === 'CUSTOMER' ? customerActionsMenu : employeeActionsMenu;
  }

  private fetchCustomerUsername(customerId: string) {
    this.customerService
      .getCustomerUsername(customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.username = response.username;
        },
        error: (err) => {
          console.error('Failed to fetch customer username:', err);
        },
      });
  }

  private fetchEmployeeUsername(employeeId: string) {
    this.employeeService
      .getEmployeeUsername(employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.username = response.username;
        },
        error: (err) => {
          console.error('Failed to fetch employee username:', err);
        },
      });
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
    this.authService
      .logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout failed', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
