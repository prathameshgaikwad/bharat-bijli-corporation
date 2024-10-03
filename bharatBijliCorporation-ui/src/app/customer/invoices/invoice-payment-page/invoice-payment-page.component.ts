import {
  BillingDetails,
  DEFAULT_BILLING_DETAILS,
  DEFAULT_PAYMENT_DETAILS,
  DEFAULT_PAYMENT_METHOD_SELECTION_DETAILS,
  Invoice,
  PaymentDetails,
  PaymentMethodSelectionDetails,
  RecordPaymentRequest,
  Transaction,
  defaultInvoice,
} from '../../../shared/types/consumables.types';
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
  paymentOptions: any[] = [];

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
    this.invoiceDetails = defaultInvoice;
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

    this.paymentOptions = [
      {
        label: 'Credit Card',
        value: TransactionMethod.CREDIT_CARD,
        icon: 'pi pi-credit-card',
      },
      {
        label: 'Debit Card',
        value: TransactionMethod.DEBIT_CARD,
        icon: 'pi pi-credit-card',
      },
      { label: 'UPI', value: TransactionMethod.UPI, icon: 'pi pi-qrcode' },
      {
        label: 'Bank Transfer',
        value: TransactionMethod.BANK_TRANSFER,
        icon: 'pi pi-building-columns',
      },
      {
        label: 'Wallet',
        value: TransactionMethod.WALLET,
        icon: 'pi pi-wallet',
      },
      {
        label: 'Cash',
        value: TransactionMethod.CASH,
        icon: 'pi pi-money-bill',
      },
    ];

    this.paymentMethodForm
      .get('paymentMethod')
      ?.valueChanges.subscribe((selectedMethod) => {
        this.paymentMethodChanged(selectedMethod);
      });
  }

  private getCustomerId(): void {
    this.customerId = this.authService.getUserId()!;
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
          this.calculateInvoiceDetails();
        },
        error: (error) => {
          console.error('Error fetching invoice details:', error);
        },
      });
  }

  private calculateInvoiceDetails() {
    // Reset discounts for recalculation
    this.billingDetails.totalDiscount = 0;
    this.billingDetails.payBeforeDueDateDiscount = 0;
    this.billingDetails.payByOnlineDiscount = 0;

    // Calculate base billing amount
    this.billingDetails.billingAmount =
      this.invoiceDetails.tariff * this.invoiceDetails.unitsConsumed;

    const currentDate = new Date();
    const dueDate = new Date(this.invoiceDetails.dueDate);

    // Apply discount if payment is before due date
    if (currentDate < dueDate) {
      this.billingDetails.payBeforeDueDateDiscount =
        this.billingDetails.billingAmount * 0.05; // 5% discount
      this.billingDetails.isPaymentBeforeDueDate = true;
    } else {
      this.billingDetails.payBeforeDueDateDiscount = 0; // No discount after due date
      this.billingDetails.isPaymentBeforeDueDate = false;
    }

    // Apply online payment discount if applicable
    if (this.billingDetails.isOnlinePayment) {
      this.billingDetails.payByOnlineDiscount =
        this.billingDetails.billingAmount * 0.05; // 5% discount for online payment
    }

    // Sum up all discounts
    this.billingDetails.totalDiscount =
      this.billingDetails.payBeforeDueDateDiscount +
      this.billingDetails.payByOnlineDiscount;

    // Calculate the final amount after all discounts
    this.billingDetails.totalAmount =
      this.billingDetails.billingAmount - this.billingDetails.totalDiscount;
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

    this.calculateInvoiceDetails();
  }
}
