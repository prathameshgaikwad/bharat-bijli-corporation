import {
  BillingDetails,
  Invoice,
  InvoiceResponse,
  PaymentDetails,
  PaymentMethodSelectionDetails,
  Transaction,
} from '../../shared/types/consumables.types';
import {
  InvoiceStatus,
  TransactionMethod,
  TransactionStatus,
} from '../../shared/types/enums.types';

import { defaultCustomer } from '../../shared/types/user.types';

export const CUSTOMER_PAYMENT_OPTIONS = [
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

export const DEFAULT_INVOICE_RESPONSE: InvoiceResponse = {
  customerId: '',
  unitsConsumed: 0,
  tariff: 0,
  periodStartDate: new Date(),
  periodEndDate: new Date(),
  dueDate: new Date(),
  invoiceStatus: InvoiceStatus.PENDING,
  employeeId: '',
};

export const DEFAULT_INVOICE: Invoice = {
  id: '',
  customerId: '',
  unitsConsumed: 0,
  tariff: 0,
  periodStartDate: new Date(),
  periodEndDate: new Date(),
  dueDate: new Date(),
  invoiceStatus: InvoiceStatus.PENDING,
};

export const DEFAULT_PAYMENT_METHOD_SELECTION_DETAILS: PaymentMethodSelectionDetails =
  {
    isCardSelected: false,
    isUpiSelected: false,
    isBankTransferSelected: false,
    isWalletSelected: false,
    isCashSelected: false,
  };

export const DEFAULT_PAYMENT_DETAILS: PaymentDetails = {
  paymentMethod: TransactionMethod.DEBIT_CARD,
  paymentDescription: 'Paid by Debit Card',
};

export const DEFAULT_BILLING_DETAILS: BillingDetails = {
  billingAmount: 0,
  isPaymentBeforeDueDate: false,
  isOnlinePayment: false,
  payBeforeDueDateDiscount: 0,
  payByOnlineDiscount: 0,
  totalDiscount: 0,
  totalAmount: 0,
};

export const DEFAULT_TRANSACTION: Transaction = {
  id: '',
  invoice: DEFAULT_INVOICE,
  customer: defaultCustomer,
  amount: 0.0,
  transactionMethod: TransactionMethod.CREDIT_CARD,
  transactionFee: 0.0,
  transactionReference: '',
  transactionStatus: TransactionStatus.PENDING,
  transactionDate: new Date(),
  description: '',
  discountByDueDate: 0.0,
  discountByOnlinePayment: 0.0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
