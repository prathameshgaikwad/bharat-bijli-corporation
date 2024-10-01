import { InvoiceStatus } from './enums.types';

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
