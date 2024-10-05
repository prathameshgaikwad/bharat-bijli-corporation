import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth.service';
import { CompanyLogoComponent } from './shared/components/company-logo/company-logo.component';
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
    CompanyLogoComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isLoading = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    const currentUrl = this.location.path() || '/';

    this.authService.checkAuthState().subscribe({
      next: (isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']).then(() => (this.isLoading = false));
        } else {
          this.smartRedirect(currentUrl);
        }
      },
      error: () => {
        this.router.navigate(['/login']).then(() => (this.isLoading = false));
      },
    });
  }

  private smartRedirect(currentUrl: string) {
    const role = this.authService.getCurrentUserRole();
    if (this.isUrlValidForRole(currentUrl, role)) {
      this.router
        .navigateByUrl(currentUrl)
        .then(() => (this.isLoading = false));
    } else {
      this.redirectBasedOnRole(role);
    }
  }

  private isUrlValidForRole(url: string, role: string): boolean {
    const validUrls: { [key: string]: string[] } = {
      CUSTOMER: ['/customer'],
      EMPLOYEE: ['/employee'],
    };

    const roleUrls = validUrls[role] || [];
    return roleUrls.some((validPrefix) => url.startsWith(validPrefix));
  }

  private redirectBasedOnRole(role: string) {
    switch (role) {
      case 'CUSTOMER':
        this.router
          .navigate(['/customer/dashboard'])
          .then(() => (this.isLoading = false));
        break;
      case 'EMPLOYEE':
        this.router
          .navigate(['/employee/dashboard'])
          .then(() => (this.isLoading = false));
        break;
      default:
        this.router.navigate(['/login']).then(() => (this.isLoading = false));
    }
  }
}
