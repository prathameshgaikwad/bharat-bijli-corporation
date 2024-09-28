import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';

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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  protected registrationForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    emailId: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    address: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    pincode: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
    dateOfBirth: new FormControl(null, [Validators.required]),
  });

  onSubmit() {
    console.log(this.registrationForm.value);
  }
}
