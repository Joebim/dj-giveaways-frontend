import api from "./api";
import { unwrapResponse } from "./http";
import type {
  Cart,
  CartCompetitionSnapshot,
  CartItem,
  AddToCartPayload,
  UpdateCartItemPayload,
} from "../types";

interface CartPayload {
  id: string;
  currency: string;
  items: Array<Record<string, any>>;
  totals: Record<string, any>;
  updatedAt: string;
}

const normalizeCompetitionSnapshot = (
  competition: Record<string, any> | null | undefined
): CartCompetitionSnapshot | null => {
  if (!competition) {
    return null;
  }

  return {
    id: competition.id || competition._id || "",
    title: competition.title,
    slug: competition.slug,
    image:
      competition.image ||
      competition.images?.[0]?.url ||
      competition.images?.[0] ||
      null,
    ticketPrice: Number(competition.ticketPrice || 0),
    maxTickets: Number(competition.maxTickets || 0),
    soldTickets: Number(competition.soldTickets || 0),
    status: competition.status,
    isActive:
      competition.isActive !== undefined
        ? Boolean(competition.isActive)
        : undefined,
    drawDate: competition.drawDate,
    category: competition.category,
  };
};

const normalizeCartItem = (item: Record<string, any>): CartItem => ({
  id: item.id || item._id,
  competitionId:
    (item.competitionId && item.competitionId._id) ||
    item.competitionId ||
    "",
  quantity: Number(item.quantity || 0),
  unitPrice: Number(item.unitPrice || 0),
  subtotal: Number(item.subtotal || 0),
  addedAt: item.addedAt,
  updatedAt: item.updatedAt,
  competition: normalizeCompetitionSnapshot(item.competition),
});

const normalizeCart = (payload: CartPayload): Cart => ({
  id: payload.id,
  currency: payload.currency,
  items: (payload.items ?? []).map(normalizeCartItem),
  totals: {
    items: Number(payload.totals?.items || 0),
    subtotal: Number(payload.totals?.subtotal || 0),
    totalTickets: Number(payload.totals?.totalTickets || 0),
  },
  updatedAt: payload.updatedAt,
});

class CartService {
  async getCart(): Promise<Cart> {
    const response = await api.get<CartPayload>("/cart");
    const { data } = unwrapResponse<CartPayload>(response);
    return normalizeCart(data);
  }

  async addOrUpdateItem(payload: AddToCartPayload): Promise<Cart> {
    const response = await api.post<CartPayload>("/cart/items", payload);
    const { data } = unwrapResponse<CartPayload>(response);
    return normalizeCart(data);
  }

  async updateItem(itemId: string, payload: UpdateCartItemPayload): Promise<Cart> {
    const response = await api.patch<CartPayload>(`/cart/items/${itemId}`, payload);
    const { data } = unwrapResponse<CartPayload>(response);
    return normalizeCart(data);
  }

  async removeItem(itemId: string): Promise<Cart> {
    const response = await api.delete<CartPayload>(`/cart/items/${itemId}`);
    const { data } = unwrapResponse<CartPayload>(response);
    return normalizeCart(data);
  }

  async clearCart(): Promise<void> {
    await api.delete("/cart");
  }
}

const cartService = new CartService();

export default cartService;

