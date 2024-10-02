import { CustomerGuard } from './core/guards/customer.guard';
import { EmpDashboardComponent } from './employee/emp-dashboard/emp-dashboard.component';
import { EmpSidebarComponent } from './employee/emp-sidebar/emp-sidebar.component';
import { EmployeeGuard } from './core/guards/employee.guard';
import { LayoutComponent } from './employee/layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { Routes } from '@angular/router';
import { AddCustComponent } from './employee/add-cust/add-cust.component';
import { TransactionsComponent } from './employee/transactions/transactions.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'customer/dashboard',
    loadComponent: () =>
      import('./customer/customer-dashboard/customer-dashboard.component').then(
        (m) => m.CustomerDashboardComponent
      ),
    canActivate: [CustomerGuard],
  },
  {
    path: 'customer/invoices',
    loadComponent: () =>
      import('./customer/invoices/invoices.component').then(
        (m) => m.InvoicesComponent
      ),
    canActivate: [CustomerGuard],
  },
  {
    path: 'customer/payments',
    loadComponent: () =>
      import('./customer/payments/payments.component').then(
        (m) => m.PaymentsComponent
      ),
    canActivate: [CustomerGuard],
  },
  {
    path: 'employee',
    loadComponent: () =>
      import('./employee/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
        import('./employee/emp-dashboard/emp-dashboard.component').then(
          (m) => m.EmpDashboardComponent
        ),
      },
      {
        path:'customer',
        component:AddCustComponent
      },
      {
        path:'transactions',
        component:TransactionsComponent
      },
    ],
    canActivate: [EmployeeGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];
