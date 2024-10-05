import {
  BillingDetails,
  Invoice,
  PaymentDetails,
  PaymentMethodSelectionDetails,
} from '../../../shared/types/consumables.types';
import {
  CUSTOMER_PAYMENT_OPTIONS,
  DEFAULT_BILLING_DETAILS,
  DEFAULT_INVOICE,
  DEFAULT_PAYMENT_DETAILS,
  DEFAULT_PAYMENT_METHOD_SELECTION_DETAILS,
} from '../../../core/helpers/constants';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Customer,
  PersonalDetails,
  defaultCustomer,
} from '../../../shared/types/user.types';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AccordionModule } from 'primeng/accordion';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CardPaymentComponent } from './card-payment/card-payment.component';
import { CashPaymentComponent } from './cash-payment/cash-payment.component';
import { CustomerService } from '../../services/customer.service';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { PanelModule } from 'primeng/panel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { TransactionMethod } from '../../../shared/types/enums.types';
import { calculateInvoiceDetails } from '../../../core/helpers/invoice';

@Component({
  selector: 'app-invoice-payment-page',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DividerModule,
    ButtonModule,
    FloatLabelModule,
    AccordionModule,
    NavbarComponent,
    DatePipe,
    PanelModule,
    SelectButtonModule,
    TooltipModule,
    CardPaymentComponent,
    CashPaymentComponent,
  ],
  templateUrl: './invoice-payment-page.component.html',
  styleUrl: './invoice-payment-page.component.css',
})
export class InvoicePaymentPageComponent implements OnInit {
  invoiceId: string = '';
  paymentMethodForm: FormGroup;
  customerId!: string;
  paymentOptions: any[] = CUSTOMER_PAYMENT_OPTIONS;

  customerDetails: PersonalDetails;
  invoiceDetails: Invoice;
  paymentDetails: PaymentDetails;
  billingDetails: BillingDetails;
  paymentMethodSelectionDetails: PaymentMethodSelectionDetails;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.invoiceDetails = DEFAULT_INVOICE;
    this.customerDetails = defaultCustomer.personalDetails;
    this.paymentDetails = DEFAULT_PAYMENT_DETAILS;
    this.billingDetails = DEFAULT_BILLING_DETAILS;
    this.paymentMethodSelectionDetails =
      DEFAULT_PAYMENT_METHOD_SELECTION_DETAILS;

    this.paymentMethodForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      paymentDescription: [''],
    });
  }

  ngOnInit(): void {
    this.getCustomerId();
    this.activatedRoute.params.subscribe((params) => {
      this.invoiceId = params['invoiceId'];
      if (this.customerId) {
        this.fetchCustomerDetails(this.customerId);
      }
      if (this.invoiceId) {
        this.fetchInvoiceDetails(this.customerId, this.invoiceId);
      }
    });

    this.paymentMethodForm
      .get('paymentMethod')
      ?.valueChanges.subscribe((selectedMethod) => {
        this.paymentMethodChanged(selectedMethod);
      });
  }

  private getCustomerId(): void {
    this.customerId = this.authService.getCurrentUserId();
    this.paymentMethodForm.patchValue({
      customerId: this.customerId,
    });
  }

  private fetchCustomerDetails(customerId: string): void {
    this.customerService.getCustomerDetails(customerId).subscribe({
      next: (customer: Customer) => {
        this.customerDetails = customer.personalDetails;
      },
      error: (error) => {
        console.error('Error fetching customer details:', error);
      },
    });
  }

  private fetchInvoiceDetails(customerId: string, invoiceId: string): void {
    this.customerService
      .getCustomerInvoiceById(customerId, invoiceId)
      .subscribe({
        next: (invoice: Invoice) => {
          this.invoiceDetails = invoice;
          this.paymentMethodForm.patchValue({ invoiceId: this.invoiceId });
          this.billingDetails = calculateInvoiceDetails(
            this.invoiceDetails,
            this.billingDetails.isOnlinePayment
          );
        },
        error: (error) => {
          console.error('Error fetching invoice details:', error);
        },
      });
  }

  paymentMethodChanged(selectedMethod: TransactionMethod) {
    this.paymentMethodSelectionDetails.isCashSelected =
      selectedMethod === TransactionMethod.CASH;
    this.paymentMethodSelectionDetails.isBankTransferSelected =
      selectedMethod === TransactionMethod.BANK_TRANSFER;
    this.paymentMethodSelectionDetails.isUpiSelected =
      selectedMethod === TransactionMethod.UPI;
    this.paymentMethodSelectionDetails.isWalletSelected =
      selectedMethod === TransactionMethod.WALLET;
    this.paymentMethodSelectionDetails.isCardSelected =
      selectedMethod === TransactionMethod.CREDIT_CARD ||
      selectedMethod === TransactionMethod.DEBIT_CARD;

    this.billingDetails.isOnlinePayment =
      !this.paymentMethodSelectionDetails.isCashSelected;

    this.billingDetails = calculateInvoiceDetails(
      this.invoiceDetails,
      this.billingDetails.isOnlinePayment
    );
  }
}
