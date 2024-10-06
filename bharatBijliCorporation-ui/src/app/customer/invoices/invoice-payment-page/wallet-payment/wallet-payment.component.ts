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

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { MessageService } from 'primeng/api';
import { PaymentSummaryComponent } from '../../../payments/payment-summary/payment-summary.component';
import { ToastModule } from 'primeng/toast';
import { TransactionMethod } from '../../../../shared/types/enums.types';

@Component({
  selector: 'app-wallet-payment',
  standalone: true,
  imports: [CommonModule, ToastModule, ButtonModule, PaymentSummaryComponent],
  templateUrl: './wallet-payment.component.html',
  styleUrl: './wallet-payment.component.css',
  providers: [MessageService],
})
export class WalletPaymentComponent implements OnInit {
  @Input({ required: true }) customerId: string;
  @Input({ required: true }) invoiceId: string;
  @Input({ required: true }) walletBalance: number;
  @Input({ required: true }) billingDetails: BillingDetails;
  @Input({ required: true }) paymentDetails: PaymentDetails;
  isSufficientBalance: boolean = false;
  isPaymentSummary: boolean = false;
  completedTransaction: Transaction = DEFAULT_TRANSACTION;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService
  ) {
    this.customerId = '';
    this.invoiceId = '';
    this.walletBalance = 0;
    this.paymentDetails = DEFAULT_PAYMENT_DETAILS;
    this.billingDetails = DEFAULT_BILLING_DETAILS;
  }

  ngOnInit(): void {
    this.checkBalance();
  }

  checkBalance() {
    if (this.billingDetails.totalAmount <= this.walletBalance) {
      this.isSufficientBalance = true;
    } else {
      this.isSufficientBalance = false;
    }
  }

  onMakePayment() {
    const paymentRequest: RecordPaymentRequest = {
      customerId: this.customerId,
      invoiceId: this.invoiceId,
      paymentMethod: TransactionMethod.WALLET,
      totalAmount: this.billingDetails.totalAmount,
      transactionDate: new Date(),
      transactionReference: `TXNREF${this.customerId}INV${this.invoiceId}`,
      discountByDueDate: this.billingDetails.payBeforeDueDateDiscount,
      discountByOnlinePayment: this.billingDetails.payByOnlineDiscount,
      paymentDescription: `Paid by ${TransactionMethod.WALLET}`,
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
  }
}
