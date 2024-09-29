import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../core/auth.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CompanyOverviewComponent } from '../../shared/components/company-overview/company-overview.component';
import { Component } from '@angular/core';
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
export class LoginComponent {
  showOtpComponent: boolean = false;
  protected loginForm = new FormGroup({
    userId: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  getUserId() {
    return this.loginForm.get('userId')?.value || '';
  }

  showErrorToast(errorMessage: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
    });
  }

  showOtpToast(otp: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `OTP received:  ${otp}`,
    });
  }

  setOtpComponentVisible() {
    this.showOtpComponent = true;
  }

  onSubmit() {
    const userId = this.loginForm.get('userId')?.value || '';

    this.authService.getOtp(userId).subscribe({
      next: (response) => {
        this.setOtpComponentVisible();
        this.showOtpToast(response.otp);
      },
      error: (error) => {
        console.error('Failure: ', error);
        this.showErrorToast(error.error.error);
      },
    });
  }
}
