import {
  InvoiceStatus,
  TransactionMethod,
  TransactionStatus,
} from './enums.types';

import { Customer } from './user.types';

export interface Invoice {
  id: string;
  customerId: string;
  unitsConsumed: number;
  tariff: number;
  periodStartDate: Date;
  periodEndDate: Date;
  dueDate: Date;
  invoiceStatus: InvoiceStatus;
}

export interface InvoiceResp {
  customerId: string;
  unitsConsumed: number;
  tariff: number;
  periodStartDate: Date;
  periodEndDate: Date;
  dueDate: Date;
  invoiceStatus: InvoiceStatus;
  employeeId : string;
}

export const defaultInvoiceResp:  InvoiceResp = {
  customerId: '',
  unitsConsumed: 0,
  tariff: 0,
  periodStartDate: new Date(),
  periodEndDate: new Date(),
  dueDate: new Date(),
  invoiceStatus: InvoiceStatus.PENDING,
  employeeId : ''
};

export interface InvoiceCustResp {
  customer : Customer
  unitsConsumed: number;
  tariff: number;
  periodStartDate: Date;
  periodEndDate: Date;
  dueDate: Date;
  invoiceStatus: InvoiceStatus;
}


export const defaultInvoice: Invoice = {
  id: '',
  customerId: '',
  unitsConsumed: 0,
  tariff: 0,
  periodStartDate: new Date(),
  periodEndDate: new Date(),
  dueDate: new Date(),
  invoiceStatus: InvoiceStatus.PENDING,
};

export interface PendingDuesResponse {
  pendingDuesTotal: number;
  invoices: Page<Invoice>;
}
export interface InvoicesByStatusResponse {
  invoiceAmountTotal: number;
  status: InvoiceStatus;
  invoices: Page<Invoice>;
}

export interface Transaction {
  id: string;
  invoice: Invoice;
  customer: Customer;
  amount: number;
  transactionMethod: TransactionMethod;
  description: string;
  transactionFee: number;
  transactionReference: string;
  transactionStatus: TransactionStatus;
  createdAt: Date;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface BillingDetails {
  billingAmount: number;
  isPaymentBeforeDueDate: boolean;
  isOnlinePayment: boolean;
  payBeforeDueDateDiscount: number;
  payByOnlineDiscount: number;
  totalDiscount: number;
  totalAmount: number;
}

export interface RecordPaymentRequest {
  customerId: string;
  invoiceId: string;
  totalAmount: number;
  discountByDueDate?: number;
  discountByOnlinePayment?: number;
  paymentMethod: TransactionMethod;
  paymentDescription?: string;
  transactionReference: string;
  transactionDate: Date;
}

export interface PaymentDetails {
  paymentMethod: TransactionMethod;
  paymentDescription: string;
}

export interface PaymentMethodSelectionDetails {
  isCardSelected: boolean;
  isUpiSelected: boolean;
  isBankTransferSelected: boolean;
  isWalletSelected: boolean;
  isCashSelected: boolean;
}

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
