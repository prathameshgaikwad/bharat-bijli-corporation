# Bharat Bijli Corporation Utility Bill Pay App

Welcome to the **Bharat Bijli Corporation (BBC)**, a comprehensive solution designed to streamline the process of utility bill payment & management.

- Shubham Kaspate - Employee Portal
- Prathamesh Gaikwad - Customer Portal

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation Instructions](#installation-instructions)
- [Screenshots](#screenshots)

## Description

The BBC Utility Bill Pay App consists of two main portals:

1. **Utility Bill Pay App (Customer Portal):** This portal is designed for customers to manage their utility bills, view invoices, make payments, and track their transaction history.
2. **Operations Portal (Employee Portal):** This portal is for employees of BBC to manage customer accounts, generate bills, track invoices, and handle administrative tasks.

## Features

### Utility Bill Pay App (Customer Portal):

- **Dashboard:** View consumption pattern, pending actions, quick access to wallet & support.
- **Bills:** View all your bills, alerts for pending & overdue bills.
- **Bill Payment:** Pay a bill with your preferred payment method.
- **Transaction History:** View all past transactions.

### Operations Portal (Employee Portal):

- **Dashboard:** View recent transactions, quick actions.
- **Customer Management:** View, add, and manage customers.
- **Bill Generation:** Generate and update bills for customers.
- **Invoice Tracking:** Track invoice creation and payment statuses.

## Installation Instructions

To set up the BBC Utility Bill Pay App locally, follow these steps:

### Prerequisites

- Node.js (v16 or higher)
- Angular CLI (v18)
- Java 21 or higher
- Maven
- MySQL or any other SQL database

### Backend Setup (Spring Boot with MySQL)

1. Clone the repository:
   ```bash
   git clone https://github.com/prathameshgaikwad/bharat-bijli-corporation
   ```
2. Navigate to backend folder:
   ```bash
   cd bharat-bijli-corporation
   ```
3. Update `application.properties`:
4. Build project:
   ```bash
   mvn clean install
   ```

### Frontend Setup (Angular)

1. Clone the repository:
   ```bash
   git clone https://github.com/prathameshgaikwad/bharat-bijli-corporation
   ```
2. Install dependencies:
   ```bash
   cd bharat-bijli-corporation-ui
   npm install
   ```
3. Start development server:
   ```bash
   ng serve
   ```
4. View the app on:
   ```bash
   http://localhost:4200/
   ```

### Screenshots

#### Customer Portal

##### Login Page

![Login Page](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/login-page.png)
![Login Page Responsive](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/login-page-responsive.png)

##### OTP Page

![Registration Page](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/otp-page.png)

##### Registration Page

![Registration Page](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/registration-page.png)

##### Dashboard

![Dashboard](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/customer-dashboard.png)

##### Bills Page

![Bills Page](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/bills-page.png)

##### Bill Summary

![Bill Summary](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/bill-summary.png)

##### Bill Payment

![Bill Payment](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/bill-payment-page.png)

##### Pay With Card

![Pay with card](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/pay-with-card.png)

##### Pay With Wallet

![Pay with wallet](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/pay-with-card.png)

##### Pay By Cash

![Pay by cash](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/pay-wth-cash.png)

##### Payment Completion

![Payment Completion](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/payment-completion.png)

##### Payment Completion - with details

![Payment Completion](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/payment-completion-with-details.png)

##### Payments Page

![Payments Page](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/payments-page.png)

##### Transaction Summary

![Transaction Summary](docs/screenshots/Utility%20Bill%20Pay%20-%20Customer/payment-summary.png)
