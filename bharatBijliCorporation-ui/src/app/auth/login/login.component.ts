import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CompanyOverviewComponent } from '../../shared/components/company-overview/company-overview.component';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { OtpInputComponent } from '../../shared/components/otp-input/otp-input.component';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent implements OnDestroy {
  private static readonly maxResends = 3;
  static resendCount: number = 0;

  showOtpComponent: boolean = false;
  isLoading: boolean = false;
  isResendButtonDisabled: boolean = true;
  isResendVisible: boolean = true;
  timeLeft: number = 30;
  countdownInterval: any;
  protected loginForm = new FormGroup({
    userId: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
    ]),
  });

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  getUserId() {
    return this.loginForm.get('userId')?.value || '';
  }

  setOtpComponentVisible() {
    this.showOtpComponent = true;
  }

  startCountdown() {
    this.isResendButtonDisabled = true;
    this.timeLeft = 30;
    this.countdownInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.countdownInterval);
        this.isResendButtonDisabled = false;
      }
    }, 1000);
  }

  onResend() {
    LoginComponent.resendCount++;
    this.submitOtpRequest();
  }

  handleResendButtonVisibility() {
    if (LoginComponent.resendCount >= LoginComponent.maxResends) {
      this.isResendVisible = false;
    }
  }

  submitOtpRequest() {
    this.isLoading = true;
    this.loginForm.disable();
    const userId = this.loginForm.get('userId')?.value || '';
    this.authService.getOtp(userId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.setOtpComponentVisible();
        this.loginForm.enable();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `OTP received:  ${response.otp}`,
        });

        this.startCountdown();
        this.handleResendButtonVisibility();
      },
      error: (error) => {
        this.isLoading = false;
        this.loginForm.enable();
        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Invalid Username',
            detail: 'Please enter the correct username',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error,
          });
        }
      },
    });
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
