import { create } from "zustand";
import type { Cart, AddToCartPayload, UpdateCartItemPayload } from "../types";
import cartService from "../services/cartService";

interface CartState {
  cart: Cart | null;
  items: Cart["items"];
  subtotal: number;
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

interface CartActions {
  fetchCart: () => Promise<void>;
  addItem: (payload: AddToCartPayload) => Promise<void>;
  updateItem: (
    itemId: string,
    payload: UpdateCartItemPayload
  ) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type CartStore = CartState & CartActions;

const emptyCart: Cart = {
  id: "",
  currency: "GBP",
  items: [],
  totals: {
    items: 0,
    subtotal: 0,
    totalTickets: 0,
  },
  updatedAt: new Date().toISOString(),
};

const deriveState = (cart: Cart | null) => {
  const safeCart = cart ?? emptyCart;
  return {
    cart,
    items: safeCart.items,
    subtotal: safeCart.totals.subtotal,
    total: safeCart.totals.subtotal,
    itemCount: safeCart.totals.totalTickets,
  };
};

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  items: [],
  subtotal: 0,
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,

  setCart: (cart) =>
    set((state) => ({
      ...state,
      ...deriveState(cart),
    })),

  setLoading: (isLoading) => set((state) => ({ ...state, isLoading })),

  setError: (error) => set((state) => ({ ...state, error })),

  fetchCart: async () => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));
      const cart = await cartService.getCart();
      set((state) => ({
        ...state,
        ...deriveState(cart),
        isLoading: false,
      }));
    } catch (error) {
      // Commented out error handling for dummy data
      // set((state) => ({
      //   ...state,
      //   isLoading: false,
      //   error:
      //     error instanceof Error ? error.message : "Failed to load cart",
      // }));
      // throw error;
      
      // For dummy data, set empty cart on error
      set((state) => ({
        ...state,
        ...deriveState(null),
        isLoading: false,
        error: null,
      }));
    }
  },

  addItem: async (payload: AddToCartPayload) => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));
      const cart = await cartService.addOrUpdateItem(payload);
      set((state) => ({
        ...state,
        ...deriveState(cart),
        isLoading: false,
      }));
    } catch (error) {
      // Commented out error handling for dummy data
      // set((state) => ({
      //   ...state,
      //   isLoading: false,
      //   error:
      //     error instanceof Error ? error.message : "Unable to add to cart",
      // }));
      // throw error;
      
      // For dummy data, don't throw error - just reset loading state
      set((state) => ({
        ...state,
        isLoading: false,
        error: null,
      }));
    }
  },

  updateItem: async (itemId: string, payload: UpdateCartItemPayload) => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));
      const cart = await cartService.updateItem(itemId, payload);
      set((state) => ({
        ...state,
        ...deriveState(cart),
        isLoading: false,
      }));
    } catch (error) {
      // Commented out error handling for dummy data
      // set((state) => ({
      //   ...state,
      //   isLoading: false,
      //   error:
      //     error instanceof Error
      //       ? error.message
      //       : "Unable to update cart item",
      // }));
      // throw error;
      
      // For dummy data, don't throw error - just reset loading state
      set((state) => ({
        ...state,
        isLoading: false,
        error: null,
      }));
    }
  },

  removeItem: async (itemId: string) => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));
      const cart = await cartService.removeItem(itemId);
      set((state) => ({
        ...state,
        ...deriveState(cart),
        isLoading: false,
      }));
    } catch (error) {
      // Commented out error handling for dummy data
      // set((state) => ({
      //   ...state,
      //   isLoading: false,
      //   error:
      //     error instanceof Error
      //       ? error.message
      //       : "Unable to remove cart item",
      // }));
      // throw error;
      
      // For dummy data, don't throw error - just reset loading state
      set((state) => ({
        ...state,
        isLoading: false,
        error: null,
      }));
    }
  },

  clearCart: async () => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));
      await cartService.clearCart();
      set((state) => ({
        ...state,
        ...deriveState(emptyCart),
        isLoading: false,
      }));
    } catch (error) {
      // Commented out error handling for dummy data
      // set((state) => ({
      //   ...state,
      //   isLoading: false,
      //   error:
      //     error instanceof Error
      //       ? error.message
      //       : "Unable to clear cart",
      // }));
      // throw error;
      
      // For dummy data, clear cart locally even if service fails
      set((state) => ({
        ...state,
        ...deriveState(emptyCart),
        isLoading: false,
        error: null,
      }));
    }
  },
}));
