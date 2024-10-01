import { Router, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { CompanyLogoComponent } from './shared/components/company-logo/company-logo.component';
import { Component } from '@angular/core';
import { CustomerNavbarComponent } from './customer/customer-navbar/customer-navbar.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoginComponent,
    RegisterComponent,
    CompanyLogoComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
