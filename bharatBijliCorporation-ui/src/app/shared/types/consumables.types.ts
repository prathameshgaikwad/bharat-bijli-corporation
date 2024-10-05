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

export interface InvoiceResponse {
  customerId: string;
  unitsConsumed: number;
  tariff: number;
  periodStartDate: Date;
  periodEndDate: Date;
  dueDate: Date;
  invoiceStatus: InvoiceStatus;
  employeeId: string;
}

export interface InvoiceCustResp {
  customer: Customer;
  unitsConsumed: number;
  tariff: number;
  periodStartDate: Date;
  periodEndDate: Date;
  dueDate: Date;
  invoiceStatus: InvoiceStatus;
}

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
  transactionFee: number | null;
  transactionReference: string;
  transactionStatus: TransactionStatus;
  transactionDate: Date;
  description: string | null;
  discountByDueDate: number | null;
  discountByOnlinePayment: number | null;
  createdAt: Date;
  updatedAt: Date;
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

export interface MonthlyUsageDetails {
  month: string;
  year: string;
  unitsConsumed: number;
}
