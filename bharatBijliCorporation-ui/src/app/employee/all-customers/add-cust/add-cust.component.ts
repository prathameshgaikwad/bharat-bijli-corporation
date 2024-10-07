import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CompanyOverviewComponent } from '../../../shared/components/company-overview/company-overview.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { PersonalDetails } from '../../../shared/types/user.types';
import { ToastModule } from 'primeng/toast';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export function dobValidator(control: AbstractControl): ValidationErrors | null {
  const dob = control.value;
  if (!dob) return null; // If no DOB is provided, return null

  const currentDate = new Date();
  const birthDate = new Date(dob);
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const month = currentDate.getMonth() - birthDate.getMonth();

  // Check if the user is under 18
  if (age < 18 || (age === 18 && month < 0)) {
    return { invalidDOB: true }; // Return an error if under 18
  }

  return null; // Valid date, return null
}

@Component({
  selector: 'app-add-cust',
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
  templateUrl: './add-cust.component.html',
  styleUrl: './add-cust.component.css',
  providers: [MessageService],
})

export class AddCustComponent {
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
    dateOfBirth: new FormControl(null, [Validators.required, dobValidator]),
  });

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.registrationForm.valid) {
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
          this.messageService.add({
            severity: 'success',
            summary: 'Registration Successful',
          });

          setTimeout(() => {
            this.router.navigate(['customer']);
          }, 3000);
        },
        error: (error) => {
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
