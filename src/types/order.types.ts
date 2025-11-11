export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  fees?: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  paymentIntentId?: string;
  paymentMethod?: string;
  billingDetails?: OrderBillingDetails;
  billingAddress?: OrderAddress;
  shippingAddress?: OrderAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  competitionId: string;
  competitionTitle: string;
  quantity: number;
  ticketPrice: number;
  total: number;
  ticketNumbers?: string[];
  answer?: string;
}

export interface OrderBillingDetails {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface OrderAddress {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country?: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";
export type OrderPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";
