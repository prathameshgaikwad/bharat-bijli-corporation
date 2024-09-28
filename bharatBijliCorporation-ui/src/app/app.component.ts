import { CompanyLogoComponent } from './shared/components/company-logo/company-logo.component';
import { Component } from '@angular/core';
import { CustomerNavbarComponent } from './customer/customer-navbar/customer-navbar.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    RegisterComponent,
    CompanyLogoComponent,
    CustomerNavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'bharatBijliCorporation-ui';
}
