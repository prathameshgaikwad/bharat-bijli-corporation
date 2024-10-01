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
  status: InvoiceStatus;
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
  createdAt : Date;
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
