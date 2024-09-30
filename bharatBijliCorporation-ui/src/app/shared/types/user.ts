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

export interface Customer {
  id: string;
  personalDetails: PersonalDetails;
  serviceConnectionStatus: string;
}

export interface User {
  id: string;
}
