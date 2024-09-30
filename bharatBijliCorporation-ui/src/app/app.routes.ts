import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { Routes } from '@angular/router';

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
  },
  {
    path: 'customer/invoices',
    loadComponent: () =>
      import('./customer/invoices/invoices.component').then(
        (m) => m.InvoicesComponent
      ),
  },
  {
    path: 'customer/payments',
    loadComponent: () =>
      import('./customer/payments/payments.component').then(
        (m) => m.PaymentsComponent
      ),
  },
  { path: '**', component: PageNotFoundComponent },
];
