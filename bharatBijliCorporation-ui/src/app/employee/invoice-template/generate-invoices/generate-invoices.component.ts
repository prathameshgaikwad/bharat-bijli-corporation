import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { CalendarModule } from 'primeng/calendar';
import { Customer } from '../../../shared/types/user.types';
import { EmployeeService } from '../../services/employee.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InvoiceResponse } from '../../../shared/types/consumables.types';
import { InvoiceStatus } from '../../../shared/types/enums.types';
import { AppStateService } from '../../../core/services/app-state.service';
import { EmployeeService } from '../../services/employee.service';
import { Customer } from '../../../shared/types/user.types';
import { ButtonModule } from 'primeng/button';

export interface InvoiceCustResp {
  customer: Customer;
}

@Component({
  selector: 'app-generate-invoices',
  standalone: true,
  imports: [
    InputTextModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    CalendarModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    ButtonModule
  ],
  templateUrl: './generate-invoices.component.html',
  styleUrl: './generate-invoices.component.css',
  providers: [MessageService],
})
export class GenerateInvoicesComponent implements OnInit {
  isloading = false;

  protected registrationForm = new FormGroup({
    periodStartDate: new FormControl(null, [Validators.required]),
    periodEndDate: new FormControl(null, [Validators.required]),
    dueDate: new FormControl(null, [Validators.required]),
    tariff: new FormControl(41.5),
    unitsConsumed: new FormControl(null, [
      Validators.required,
      Validators.min(0),
    ]),
    customerId: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9]{5,}$'),
    ]),
  });

  constructor(
    private authService: AuthService,
    private invoiceGen: EmployeeService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.empId = this.authService.getCurrentUserId();
  }

  empId = '';
  invoice!: InvoiceCustResp;

  onSubmit() {
    if (this.registrationForm.valid) {
      const billingDetails: InvoiceResponse = {
        dueDate: this.registrationForm.value.dueDate!,
        periodStartDate: this.registrationForm.value.periodStartDate!,
        periodEndDate: this.registrationForm.value.periodEndDate!,
        tariff: this.registrationForm.value.tariff!,
        unitsConsumed: this.registrationForm.value.unitsConsumed!,
        customerId: this.registrationForm.value.customerId!,
        employeeId: this.empId,
        invoiceStatus: InvoiceStatus.PENDING,
      };

      this.isloading = true;
      if (billingDetails.periodEndDate < billingDetails.periodStartDate) {
        this.isloading = false;
        this.registrationForm
          .get('periodEndDate')
          ?.setErrors({ notGreater: true });
        this.registrationForm.get('periodEndDate')?.markAsTouched();
        this.messageService.add({
          severity: 'warn',
          summary: 'End Date must be greater than start',
          detail: `Check End Date.`,
        });
        return;
      }

      this.invoiceGen.generateInvoice(billingDetails).subscribe({
        next: (response) => {
          this.invoice = response;
          const userName =
            this.invoice.customer.personalDetails.firstName +
            ' ' +
            this.invoice.customer.personalDetails.lastName;
          this.messageService.add({
            severity: 'success',
            summary: 'Registration Successful',
            detail:
              `Billing details submitted ` +
              ` to ` +
              userName +
              ` successfully.`,
          });
          setTimeout(() => {
            this.isloading = false;
            this.router.navigate(['/employee/emp-invoices']); // Adjust this to your desired route
          }, 2000);
        },
        error: (error) => {
          this.isloading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error creating an invoice',
            detail: error.error.message || 'Failed to submit billing details',
          });
        },
      });
    } else {
      this.isloading = false;
      this.registrationForm.markAllAsTouched(); // Highlight validation errors
    }
  }
}
