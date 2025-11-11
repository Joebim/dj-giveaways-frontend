// import api from "./api";
// import { unwrapResponse } from "./http";
import type {
  Cart,
  CartItem,
  AddToCartPayload,
  UpdateCartItemPayload,
} from "../types";
import { DUMMY_COMPETITIONS } from "../data/dummyData";

// Commented out - not needed for local storage cart
// interface CartPayload {
//   id: string;
//   currency: string;
//   items: Array<Record<string, any>>;
//   totals: Record<string, any>;
//   updatedAt: string;
// }

// const normalizeCompetitionSnapshot = (
//   competition: Record<string, any> | null | undefined
// ): CartCompetitionSnapshot | null => {
//   if (!competition) {
//     return null;
//   }

//   return {
//     id: competition.id || competition._id || "",
//     title: competition.title,
//     slug: competition.slug,
//     image:
//       competition.image ||
//       competition.images?.[0]?.url ||
//       competition.images?.[0] ||
//       null,
//     ticketPrice: Number(competition.ticketPrice || 0),
//     maxTickets: Number(competition.maxTickets || 0),
//     soldTickets: Number(competition.soldTickets || 0),
//     status: competition.status,
//     isActive:
//       competition.isActive !== undefined
//         ? Boolean(competition.isActive)
//         : undefined,
//     drawDate: competition.drawDate,
//     category: competition.category,
//   };
// };

// const normalizeCartItem = (item: Record<string, any>): CartItem => ({
//   id: item.id || item._id,
//   competitionId:
//     (item.competitionId && item.competitionId._id) ||
//     item.competitionId ||
//     "",
//   quantity: Number(item.quantity || 0),
//   unitPrice: Number(item.unitPrice || 0),
//   subtotal: Number(item.subtotal || 0),
//   addedAt: item.addedAt,
//   updatedAt: item.updatedAt,
//   competition: normalizeCompetitionSnapshot(item.competition),
// });

// Commented out - not needed for local storage cart
// const normalizeCart = (payload: CartPayload): Cart => ({
//   id: payload.id,
//   currency: payload.currency,
//   items: (payload.items ?? []).map(normalizeCartItem),
//   totals: {
//     items: Number(payload.totals?.items || 0),
//     subtotal: Number(payload.totals?.subtotal || 0),
//     totalTickets: Number(payload.totals?.totalTickets || 0),
//   },
//   updatedAt: payload.updatedAt,
// });

// Local storage key for cart
const CART_STORAGE_KEY = "dj_giveaways_cart";

// Helper functions for localStorage
const getStoredCart = (): Cart | null => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as Cart;
  } catch {
    return null;
  }
};

const saveCart = (cart: Cart): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    // Silently fail if localStorage is not available
    console.warn("Failed to save cart to localStorage", error);
  }
};

// Get competition from dummy data
const getDummyCompetition = (competitionId: string) => {
  return DUMMY_COMPETITIONS.find((c) => c.id === competitionId);
};

// Generate a unique item ID
const generateItemId = (): string => {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

class CartService {
  async getCart(): Promise<Cart> {
    // Commented out API call - using local storage
    // const response = await api.get<CartPayload>("/cart");
    // const { data } = unwrapResponse<CartPayload>(response);
    // return normalizeCart(data);

    // Return cart from local storage or empty cart
    const storedCart = getStoredCart();
    if (storedCart) {
      return storedCart;
    }

    // Return empty cart
    return {
      id: "cart_local",
      currency: "GBP",
      items: [],
      totals: {
        items: 0,
        subtotal: 0,
        totalTickets: 0,
      },
      updatedAt: new Date().toISOString(),
    };
  }

  async addOrUpdateItem(payload: AddToCartPayload): Promise<Cart> {
    // Commented out API call - using local storage
    // const response = await api.post<CartPayload>("/cart/items", payload);
    // const { data } = unwrapResponse<CartPayload>(response);
    // return normalizeCart(data);

    // Get current cart
    const currentCart = await this.getCart();
    const competition = getDummyCompetition(payload.competitionId);

    if (!competition) {
      throw new Error("Competition not found");
    }

    // Check if item already exists
    const existingItemIndex = currentCart.items.findIndex(
      (item) => item.competitionId === payload.competitionId
    );

    const ticketPrice = competition.price;
    const now = new Date().toISOString();

    let updatedItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Update existing item
      const existingItem = currentCart.items[existingItemIndex];
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + payload.quantity,
        subtotal: (existingItem.quantity + payload.quantity) * ticketPrice,
        updatedAt: now,
      };
    } else {
      // Add new item
      const newItem: CartItem = {
        id: generateItemId(),
        competitionId: payload.competitionId,
        quantity: payload.quantity,
        unitPrice: ticketPrice,
        subtotal: payload.quantity * ticketPrice,
        addedAt: now,
        updatedAt: now,
        competition: {
          id: competition.id,
          title: competition.title,
          image: competition.image,
          ticketPrice: competition.price,
          maxTickets: competition.maxTickets,
          soldTickets: competition.soldTickets,
          status: competition.status,
          drawDate: competition.drawDate,
          category: competition.category,
        },
      };
      updatedItems = [...currentCart.items, newItem];
    }

    // Calculate totals
    const totalTickets = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      totals: {
        items: updatedItems.length,
        subtotal,
        totalTickets,
      },
      updatedAt: now,
    };

    // Save to local storage
    saveCart(updatedCart);

    return updatedCart;
  }

  async updateItem(itemId: string, payload: UpdateCartItemPayload): Promise<Cart> {
    // Commented out API call - using local storage
    // const response = await api.patch<CartPayload>(`/cart/items/${itemId}`, payload);
    // const { data } = unwrapResponse<CartPayload>(response);
    // return normalizeCart(data);

    // Get current cart
    const currentCart = await this.getCart();
    const itemIndex = currentCart.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    // Update item
    const updatedItems = [...currentCart.items];
    const item = updatedItems[itemIndex];
    updatedItems[itemIndex] = {
      ...item,
      quantity: payload.quantity,
      subtotal: payload.quantity * item.unitPrice,
      updatedAt: new Date().toISOString(),
    };

    // Calculate totals
    const totalTickets = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      totals: {
        items: updatedItems.length,
        subtotal,
        totalTickets,
      },
      updatedAt: new Date().toISOString(),
    };

    // Save to local storage
    saveCart(updatedCart);

    return updatedCart;
  }

  async removeItem(itemId: string): Promise<Cart> {
    // Commented out API call - using local storage
    // const response = await api.delete<CartPayload>(`/cart/items/${itemId}`);
    // const { data } = unwrapResponse<CartPayload>(response);
    // return normalizeCart(data);

    // Get current cart
    const currentCart = await this.getCart();
    const updatedItems = currentCart.items.filter((item) => item.id !== itemId);

    // Calculate totals
    const totalTickets = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      totals: {
        items: updatedItems.length,
        subtotal,
        totalTickets,
      },
      updatedAt: new Date().toISOString(),
    };

    // Save to local storage
    saveCart(updatedCart);

    return updatedCart;
  }

  async clearCart(): Promise<void> {
    // Commented out API call - using local storage
    // await api.delete("/cart");

    // Clear from local storage
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      // Silently fail if localStorage is not available
      console.warn("Failed to clear cart from localStorage", error);
    }
  }
}

const cartService = new CartService();

export default cartService;

