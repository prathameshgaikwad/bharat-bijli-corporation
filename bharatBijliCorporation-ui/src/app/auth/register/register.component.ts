import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CompanyOverviewComponent } from '../../shared/components/company-overview/company-overview.component';
import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { PersonalDetails } from '../../shared/types/user.types';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    RouterModule,
    CalendarModule,
    ToastModule,
    CompanyOverviewComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService],
})
export class RegisterComponent {
  protected registrationForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    emailId: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    address: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    pincode: new FormControl(null, [
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
    dateOfBirth: new FormControl(null, [Validators.required]),
  });
  isSubmitting: boolean;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.isSubmitting = false;
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      const personalDetails: PersonalDetails = {
        firstName: this.registrationForm.value.firstName!,
        lastName: this.registrationForm.value.lastName!,
        emailId: this.registrationForm.value.emailId!,
        phoneNumber: '+91' + this.registrationForm.value.phoneNumber!,
        address: this.registrationForm.value.address || '',
        city: this.registrationForm.value.city || '',
        state: this.registrationForm.value.state || '',
        pincode: this.registrationForm.value.pincode
          ? this.registrationForm.value.pincode
          : 0,
        dateOfBirth: this.registrationForm.value.dateOfBirth!,
      };
      this.authService.register(personalDetails).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'success',
            summary: `${response.customer.id}`,
            detail: `Successful. Please use this ID to login. Redirecting in 10s.`,
          });

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 10000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error creating an account',
            detail: error.error.message,
          });
        },
      });
    }
  }
}
