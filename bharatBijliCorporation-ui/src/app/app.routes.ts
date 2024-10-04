import { CustomerGuard } from './core/guards/customer.guard';
import { EmpDashboardComponent } from './employee/emp-dashboard/emp-dashboard.component';
import { EmpSidebarComponent } from './employee/emp-sidebar/emp-sidebar.component';
import { EmployeeGuard } from './core/guards/employee.guard';
import { LayoutComponent } from './employee/layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { Routes } from '@angular/router';
import { AddCustComponent } from './employee/all-customers/add-cust/add-cust.component';
import { TransactionsComponent } from './employee/transactions/transactions.component';
import { InvoicesComponent } from './customer/invoices/invoices.component';;
import { GenerateInvoicesComponent } from './employee/invoice-template/generate-invoices/generate-invoices.component';
import { InvoiceTemplateComponent } from './employee/invoice-template/invoice-template.component';
import { EmpInvoicesComponent } from './employee/invoice-template/invoices-emp/invoices-emp.component';
import { AllCustomersComponent } from './employee/all-customers/all-customers.component';
import { ViewCustomersComponent } from './employee/all-customers/view-customers/view-customers.component';
import { BulkCustComponent } from './employee/all-customers/bulk-cust/bulk-cust.component';
import { BulkInvoiceComponent } from './employee/invoice-template/bulk-invoice/bulk-invoice.component';

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
    path: 'customer/invoices/:invoiceId/payment',
    loadComponent: () =>
      import(
        './customer/invoices/invoice-payment-page/invoice-payment-page.component'
      ).then((m) => m.InvoicePaymentPageComponent),
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
        path: 'customer',
        component: AllCustomersComponent,
        children:[
          {
            path: '',
            component:ViewCustomersComponent
          },
          {
            path:'add',
            component:AddCustComponent
          },
          {
            path:'bulk-add',
            component:BulkCustComponent
          }
        ]
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'emp-invoices',
        component: InvoiceTemplateComponent,
        children: [
          {
            path: '',
            component: EmpInvoicesComponent,
          },
          {
            path: 'add',
            component: GenerateInvoicesComponent,
          },
          {
            path:'bulk-upload',
            component:BulkInvoiceComponent
          }
        ],
      },
    ],
    canActivate: [EmployeeGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];
