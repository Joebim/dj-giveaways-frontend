export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: PaymentIntentStatus;
}

export type PaymentIntentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "requires_action"
  | "processing"
  | "succeeded"
  | "canceled";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  card?: CardDetails;
  billingDetails: BillingDetails;
}

export type PaymentMethodType = "card" | "paypal" | "bank_transfer";

export interface CardDetails {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface BillingDetails {
  name: string;
  email: string;
  phone?: string;
  address: Address;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface PaymentData {
  paymentMethodId: string;
  billingDetails: BillingDetails;
}
