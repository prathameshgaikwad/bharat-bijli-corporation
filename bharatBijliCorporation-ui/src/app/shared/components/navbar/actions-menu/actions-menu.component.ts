import { AuthService, AuthState } from '../../../../core/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConfirmationService,
  MenuItem,
  MenuItemCommandEvent,
} from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CustomerService } from '../../../../customer/services/customer.service';
import { EmployeeService } from '../../../../employee/services/employee.service';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-actions-menu',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    RouterModule,
    MenuModule,
    ConfirmDialogModule,
  ],
  templateUrl: './actions-menu.component.html',
  styleUrl: './actions-menu.component.css',
  providers: [ConfirmationService],
})
export class ActionsMenuComponent implements OnInit, OnDestroy {
  username: string = '';
  userId: string = '';
  role: string = 'GUEST';
  private destroy$ = new Subject<void>();

  items: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private customerService: CustomerService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    this.role = this.authService.getCurrentUserRole();

    if (this.role === 'CUSTOMER') {
      this.fetchCustomerUsername(this.userId);
    } else {
      this.fetchEmployeeUsername(this.userId);
    }

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
          const newState: AuthState = {
            username: response.username,
            ...this.authService.getAuthState(),
          };
          this.authService.updateAuthState(newState);
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
          const newState: AuthState = {
            username: response.username,
            ...this.authService.getAuthState(),
          };
          this.authService.updateAuthState(newState);
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
