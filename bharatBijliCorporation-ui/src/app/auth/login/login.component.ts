import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CompanyOverviewComponent } from '../../shared/components/company-overview/company-overview.component';
import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { OtpInputComponent } from '../../shared/components/otp-input/otp-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    OtpInputComponent,
    CommonModule,
    CompanyOverviewComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showOtpComponent: boolean = false;
  protected loginForm = new FormGroup({
    customerId: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const customerId = this.loginForm.get('customerId')?.value || '';

    this.showOtpComponent = true;
    this.authService.getOtp(customerId).subscribe({
      next: (response) => {
        alert(`OTP received:  ${response.otp}`);
      },
      error: (error) => {
        console.error('Failure: ', error);
      },
    });
  }
}
