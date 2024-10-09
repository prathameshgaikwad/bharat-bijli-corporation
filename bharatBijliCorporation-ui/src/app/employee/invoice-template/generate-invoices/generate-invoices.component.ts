import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { Customer } from '../../../shared/types/user.types';
import { EmployeeService } from '../../services/employee.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InvoiceResponse } from '../../../shared/types/consumables.types';
import { InvoiceStatus } from '../../../shared/types/enums.types';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const startDate = control.get('periodStartDate')?.value;
    const endDate = control.get('periodEndDate')?.value;
    const dueDate = control.get('dueDate')?.value;
    const currentDate = new Date();

    if(endDate){
      const isEndDateLessThanCurrent = new Date(endDate) <= currentDate;
      if(!isEndDateLessThanCurrent){
        return {endDateNotBeforeCurrent : true}
      }
    }

    if(endDate && startDate){
      const isEndDateGreaterThanStartDate = new Date(endDate) > new Date(startDate);
      if (!isEndDateGreaterThanStartDate) {
        return { endDateBeforeStartDate: true };
      }

    }

    if (startDate && endDate && dueDate) {
      const isEndDateGreaterThanStartDate = new Date(endDate) > new Date(startDate);
      const isDueDateGreaterThanEndDate = new Date(dueDate) > new Date(endDate);
      const isEndDateLessThanCurrent = new Date(endDate) <= currentDate;

      if (!isEndDateGreaterThanStartDate) {
        return { endDateBeforeStartDate: true };
      }

      if (!isDueDateGreaterThanEndDate) {
        return { dueDateBeforeEndDate: true };
      }
      
      if (!isEndDateLessThanCurrent) {
        return { endDateNotBeforeCurrent: true };
      }
    }

    return null; 
  };
}

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
    ButtonModule,
    CommonModule
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
  },{ validators: dateRangeValidator() });

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
          this.messageService.add({
            severity: 'error',
            summary: 'Error creating an invoice',
            detail: error.error || 'Failed to submit billing details',
          });
          this.isloading = false;
        },
      });
    } else {
      this.isloading = false;
      this.registrationForm.markAllAsTouched(); // Highlight validation errors
    }
  }
}
