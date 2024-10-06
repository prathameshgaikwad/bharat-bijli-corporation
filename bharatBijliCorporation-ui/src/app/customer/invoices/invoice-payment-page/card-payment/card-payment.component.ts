import {} from '../invoice-payment-page.component';

import {
  BillingDetails,
  PaymentDetails,
  RecordPaymentRequest,
  Transaction,
} from '../../../../shared/types/consumables.types';
import { Component, Input, OnInit } from '@angular/core';
import {
  DEFAULT_BILLING_DETAILS,
  DEFAULT_PAYMENT_DETAILS,
  DEFAULT_TRANSACTION,
} from '../../../../core/helpers/constants';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CustomerService } from '../../../services/customer.service';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { PaymentSummaryComponent } from '../../../payments/payment-summary/payment-summary.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-card-payment',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    DividerModule,
    PasswordModule,
    CalendarModule,
    ToastModule,
    DialogModule,
    PaymentSummaryComponent,
  ],
  templateUrl: './card-payment.component.html',
  styleUrl: './card-payment.component.css',
  providers: [MessageService],
})
export class CardPaymentComponent implements OnInit {
  @Input({ required: true }) customerId: string;
  @Input({ required: true }) invoiceId: string;
  @Input({ required: true }) billingDetails: BillingDetails;
  @Input({ required: true }) paymentDetails: PaymentDetails;
  cardDetails: FormGroup;
  minDate: Date;
  isPaymentSummary: boolean = false;
  completedTransaction: Transaction = DEFAULT_TRANSACTION;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private messageService: MessageService
  ) {
    this.customerId = '';
    this.invoiceId = '';
    this.paymentDetails = DEFAULT_PAYMENT_DETAILS;
    this.billingDetails = DEFAULT_BILLING_DETAILS;
    this.minDate = new Date();

    this.cardDetails = this.fb.group({
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      cardHolderName: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
      ],
    });
  }

  ngOnInit(): void {}

  onMakePayment() {
    if (this.cardDetails.valid) {
      const paymentRequest: RecordPaymentRequest = {
        customerId: this.customerId,
        invoiceId: this.invoiceId,
        paymentMethod: this.paymentDetails.paymentMethod,
        totalAmount: this.billingDetails.totalAmount,
        transactionDate: new Date(),
        transactionReference: `TXNREF${this.customerId}INV${this.invoiceId}`,
        discountByDueDate: this.billingDetails.payBeforeDueDateDiscount,
        discountByOnlinePayment: this.billingDetails.payByOnlineDiscount,
        paymentDescription: `Paid by ${this.paymentDetails.paymentMethod}`,
      };

      this.customerService.recordPayment(paymentRequest).subscribe({
        next: (transaction: Transaction) => {
          this.completedTransaction = transaction;
          this.isPaymentSummary = true;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Transaction Failed!',
            detail: `Please try again later`,
          });
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
