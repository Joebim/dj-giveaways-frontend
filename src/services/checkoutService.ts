import api from "./api";
import { unwrapResponse } from "./http";
import type {
  CheckoutConfirmRequest,
  CheckoutConfirmResponse,
  CheckoutPaymentIntentRequest,
  CheckoutPaymentResponse,
} from "../types";

class CheckoutService {
  async createPaymentIntent(
    payload: CheckoutPaymentIntentRequest
  ): Promise<CheckoutPaymentResponse> {
    const response = await api.post<CheckoutPaymentResponse>(
      "/checkout/payment-intent",
      payload
    );
    const { data } = unwrapResponse<CheckoutPaymentResponse>(response);
    return {
      order: data.order,
      payment: data.payment,
    };
  }

  async confirmOrder(
    payload: CheckoutConfirmRequest
  ): Promise<CheckoutConfirmResponse> {
    const response = await api.post<CheckoutConfirmResponse>(
      "/checkout/confirm",
      payload
    );
    const { data } = unwrapResponse<CheckoutConfirmResponse>(response);
    return data;
  }
}

const checkoutService = new CheckoutService();

export default checkoutService;

