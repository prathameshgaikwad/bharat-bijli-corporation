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
