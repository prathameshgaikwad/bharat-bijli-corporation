import { EmployeeStatus, ServiceConnectionStatus } from './enums.types';

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  dateOfBirth: Date;
}

export const defaultPersonalDetails: PersonalDetails = {
  firstName: '',
  lastName: '',
  emailId: '',
  phoneNumber: '',
  address: '',
  city: '',
  state: '',
  pincode: 0,
  dateOfBirth: new Date(),
};

export interface Customer {
  id: string;
  personalDetails: PersonalDetails;
  serviceConnectionStatus: ServiceConnectionStatus;
}

export interface Employee {
  id: string;
  personalDetails: PersonalDetails;
  employeeStatus: EmployeeStatus;
}

export const defaultCustomer: Customer = {
  id: '',
  serviceConnectionStatus: ServiceConnectionStatus.ACTIVE,
  personalDetails: defaultPersonalDetails,
};

export interface User {
  id: string;
}
