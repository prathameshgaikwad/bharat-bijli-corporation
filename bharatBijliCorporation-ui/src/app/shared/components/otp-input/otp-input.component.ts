import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { LoginRequest } from '../../types/auth.types';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputOtpModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.css',
  providers: [MessageService],
})
export class OtpInputComponent {
  length: number = 6;
  @Input({ required: true }) userId!: string;
  isLoading: boolean = false;

  otpForm = new FormGroup({
    otp: new FormControl(null, [
      Validators.required,
      Validators.minLength(this.length),
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
    if (this.otpForm.valid) {
      this.isLoading = true;
      const loginRequest: LoginRequest = {
        userId: this.userId,
        otp: this.otpForm.value.otp || '',
      };
      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          const role = this.authService.getUserRole();
          if (role === 'CUSTOMER') {
            this.router.navigate(['/customer/dashboard']);
          } else {
            this.router.navigate(['/employee/dashboard']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);

          if (err.status === 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Invalid OTP',
              detail: 'Please try again',
            });
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Something went wrong',
              detail: 'Please try again later',
            });
          }
        },
      });
    }
  }
}
