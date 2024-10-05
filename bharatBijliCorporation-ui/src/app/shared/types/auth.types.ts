import { Customer } from './user.types';

export interface OtpResponse {
  message: string;
  otp: string;
}

export interface LoginRequest {
  userId: string;
  otp: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  userId: string;
}

export interface RegistrationResponse {
  customer: Customer;
}

export interface UsernameResponse {
  username: string;
}
