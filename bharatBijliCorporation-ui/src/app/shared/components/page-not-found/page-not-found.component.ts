import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
})
export class PageNotFoundComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navigateHome() {
    if (this.authService.getCurrentUserRole() === 'CUSTOMER') {
      this.router.navigate(['/customer/dashboard']);
    } else {
      this.router.navigate(['/employee/dashboard']);
    }
  }
}
