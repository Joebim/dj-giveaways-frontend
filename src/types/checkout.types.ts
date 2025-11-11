import type { CompetitionEntry } from "./competition.types";
import type { Order } from "./order.types";

export interface CheckoutItemInput {
  competitionId: string;
  quantity: number;
  answer: string;
}

export interface CheckoutBillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CheckoutAddress {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country?: string;
}

export interface CheckoutPaymentIntentRequest {
  items: CheckoutItemInput[];
  billingDetails?: CheckoutBillingDetails;
  billingAddress?: CheckoutAddress;
  shippingAddress?: CheckoutAddress;
  orderId?: string;
}

export interface CheckoutPaymentResponse {
  order: Order;
  payment: {
    clientSecret: string;
    amount: number;
    currency: string;
  };
}

export interface CheckoutConfirmRequest {
  paymentIntentId: string;
  orderId?: string;
  billingDetails?: CheckoutBillingDetails;
  billingAddress?: CheckoutAddress;
  shippingAddress?: CheckoutAddress;
}

export interface CheckoutConfirmResponse {
  order: Order;
  entries: CompetitionEntry[];
}

