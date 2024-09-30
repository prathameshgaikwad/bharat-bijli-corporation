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
}

export interface RegistrationResponse {
  customerId: string;
  firstName: string;
}
