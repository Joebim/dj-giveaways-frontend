export interface CartCompetitionSnapshot {
  id: string;
  title: string;
  slug?: string;
  image?: string | null;
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
  status?: string;
  isActive?: boolean;
  drawDate?: string;
  category?: string;
}

export interface CartItem {
  id: string;
  competitionId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  addedAt: string;
  updatedAt: string;
  competition?: CartCompetitionSnapshot | null;
}

export interface CartTotals {
  items: number;
  subtotal: number;
  totalTickets: number;
}

export interface Cart {
  id: string;
  currency: string;
  items: CartItem[];
  totals: CartTotals;
  updatedAt: string;
}

export interface AddToCartPayload {
  competitionId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
