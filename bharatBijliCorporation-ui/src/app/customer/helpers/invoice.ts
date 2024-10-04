import { BillingDetails, Invoice } from '../../shared/types/consumables.types';

export function calculateInvoiceDetails(
  invoiceDetails: Invoice,
  isOnlinePayment: boolean = false
): BillingDetails {
  const billingDetails: BillingDetails = {
    totalDiscount: 0,
    payBeforeDueDateDiscount: 0,
    payByOnlineDiscount: 0,
    billingAmount: 0,
    totalAmount: 0,
    isPaymentBeforeDueDate: false,
    isOnlinePayment,
  };

  // Calculate base billing amount
  billingDetails.billingAmount =
    invoiceDetails.tariff * invoiceDetails.unitsConsumed;

  const currentDate = new Date();
  const dueDate = new Date(invoiceDetails.dueDate);

  // Apply discount if payment is before due date
  if (currentDate < dueDate) {
    billingDetails.payBeforeDueDateDiscount =
      billingDetails.billingAmount * 0.05; // 5% discount
    billingDetails.isPaymentBeforeDueDate = true;
  } else {
    billingDetails.payBeforeDueDateDiscount = 0; // No discount after due date
    billingDetails.isPaymentBeforeDueDate = false;
  }

  // Apply online payment discount if applicable
  if (billingDetails.isOnlinePayment) {
    billingDetails.payByOnlineDiscount = billingDetails.billingAmount * 0.05; // 5% discount for online payment
  }

  // Sum up all discounts
  billingDetails.totalDiscount =
    billingDetails.payBeforeDueDateDiscount +
    billingDetails.payByOnlineDiscount;

  // Calculate the final amount after all discounts
  billingDetails.totalAmount =
    billingDetails.billingAmount - billingDetails.totalDiscount;

  return billingDetails;
}
