import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CompanyInfoComponent } from '../../shared/components/company-info/company-info.component';
import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CompanyInfoComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  protected loginForm = new FormGroup({
    customerId: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const customerId = this.loginForm.get('customerId')?.value || '';

    this.authService.login(customerId).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // Optionally store user info or token and navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }
}
