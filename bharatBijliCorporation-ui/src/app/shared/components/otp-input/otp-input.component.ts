import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputOtpModule, ButtonModule],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.css',
})
export class OtpInputComponent {
  length: number = 6;
  otpForm = new FormGroup({
    otp: new FormControl(null, [
      Validators.required,
      Validators.minLength(this.length),
    ]),
  });

  onSubmit() {
    if (this.otpForm.valid) {
      alert(this.otpForm.value);
    }
  }
}
