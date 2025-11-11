import api from "./api";
import { unwrapResponse } from "./http";
import type { Order } from "../types";

interface OrderListPayload {
  orders: Order[];
}

interface OrderPayload {
  order: Order;
}

class OrderService {
  async getOrders(params?: { page?: number; limit?: number; status?: string; paymentStatus?: string }) {
    const response = await api.get<OrderListPayload>("/orders", {
      params,
    });
    const { data, meta } = unwrapResponse<OrderListPayload>(response);
    return {
      orders: data?.orders ?? [],
      meta,
    };
  }

  async getMyOrders(params?: { page?: number; limit?: number; status?: string; paymentStatus?: string }) {
    const response = await api.get<OrderListPayload>("/orders/my-orders", {
      params,
    });
    const { data, meta } = unwrapResponse<OrderListPayload>(response);
    return {
      orders: data?.orders ?? [],
      meta,
    };
  }

  async getOrderById(id: string) {
    const response = await api.get<OrderPayload>(`/orders/${id}`);
    const { data } = unwrapResponse<OrderPayload>(response);
    return data.order;
  }

  // Admin endpoints
  async getAdminOrders(params?: { page?: number; limit?: number; status?: string; paymentStatus?: string; search?: string }) {
    const response = await api.get<OrderListPayload>("/admin/orders", {
      params,
    });
    const { data, meta } = unwrapResponse<OrderListPayload>(response);
    return {
      orders: data?.orders ?? [],
      meta,
    };
  }
}

const orderService = new OrderService();

export default orderService;

