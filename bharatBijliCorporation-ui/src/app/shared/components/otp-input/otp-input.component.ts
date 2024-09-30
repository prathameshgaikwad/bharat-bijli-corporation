import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../core/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { LoginRequest } from '../../types/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputOtpModule, ButtonModule],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.css',
})
export class OtpInputComponent {
  length: number = 6;
  @Input({ required: true }) userId!: string;

  otpForm = new FormGroup({
    otp: new FormControl(null, [
      Validators.required,
      Validators.minLength(this.length),
    ]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.otpForm.valid) {
      const loginRequest: LoginRequest = {
        userId: this.userId,
        otp: this.otpForm.value.otp || '',
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          const { token } = response;
          this.authService.setToken(token);
          const role = this.authService.getUserRole();

          if (role === 'CUSTOMER') {
            this.router.navigate(['/customer/dashboard']);
          } else {
            this.router.navigate(['/employee/dashboard']);
          }
        },
        error: (err) => {
          console.error('Login failed: ', err);
        },
      });
    }
  }
}
