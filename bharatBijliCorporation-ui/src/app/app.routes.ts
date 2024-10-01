import { CustomerGuard } from './core/guards/customer.guard';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { Routes } from '@angular/router';
import { LayoutComponent } from './employee/layout/layout.component';
import { EmpDashboardComponent } from './employee/emp-dashboard/emp-dashboard.component';
import { EmployeeGuard } from './core/guards/employee.guard';
import { EmpSidebarComponent } from './employee/emp-sidebar/emp-sidebar.component';

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
    // canActivate: [CustomerGuard],
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
  }, {
    path:'employee',
    component:LayoutComponent,
    children:[
      {
        path:'dashboard',
        component:EmpDashboardComponent
      },
      {
        path:'side',
        component:EmpSidebarComponent
      }
    ],
    canActivate:[EmployeeGuard]
  },
  { path: '**', component: PageNotFoundComponent },
];
