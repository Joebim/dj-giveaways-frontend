import type { Competition } from "./competition.types";
import type { User } from "./user.types";

export interface Winner {
  id: string;
  competitionId: string;
  competition: Competition;
  userId: string;
  user: User;
  ticketNumber: number;
  prize: string;
  prizeValue: number;
  cashAlternative?: number;
  chosenPrize: "original" | "cash";
  drawDate: Date;
  claimedAt?: Date;
  status: WinnerStatus;
  testimonial?: string;
  image?: string;
  createdAt: Date;
}

export type WinnerStatus = "pending" | "claimed" | "delivered" | "completed";

export interface WinnerTestimonial {
  id: string;
  winnerId: string;
  content: string;
  rating: number;
  isApproved: boolean;
  createdAt: Date;
}

export interface RecentWinner {
  id: string;
  name: string;
  location: string;
  prize: string;
  drawDate: Date;
  testimonial?: string;
  image?: string;
}

// ==================== DRAWS ====================

export interface Draw {
  id: string;
  competitionId: string;
  competitionTitle?: string;
  prizeName: string;
  prizeValue?: number;
  winnerId?: string;
  winnerName: string;
  winnerLocation: string;
  drawDate: string;
  drawnAt?: string;
  totalTickets: number;
  winningTicketNumber: number;
  imageUrl?: string;
  publicId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDrawRequest {
  competitionId: string;
  winnerId: string;
  winnerName: string;
  winnerLocation: string;
  totalTickets: number;
  winningTicketNumber: number;
  drawDate?: string | Date;
  imageUrl?: string;
  publicId?: string;
}

export interface UpdateDrawRequest {
  winnerName?: string;
  winnerLocation?: string;
  drawDate?: string | Date;
  totalTickets?: number;
  winningTicketNumber?: number;
  imageUrl?: string;
  publicId?: string;
  isActive?: boolean;
}

// ==================== CHAMPIONS ====================

export interface ChampionImage {
  url: string;
  publicId: string;
}

export interface Champion {
  id: string;
  drawId?: string;
  competitionId: string;
  competitionTitle?: string;
  winnerId?: string;
  winnerName: string;
  winnerLocation: string;
  prizeName: string;
  prizeValue?: string;
  testimonial: string;
  image: ChampionImage;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChampionRequest {
  drawId: string;
  testimonial: string;
  image?: File;
  winnerName?: string;
  winnerLocation?: string;
  prizeValue?: string;
  featured?: boolean;
}

export interface UpdateChampionRequest {
  winnerName?: string;
  winnerLocation?: string;
  prizeName?: string;
  prizeValue?: string;
  testimonial?: string;
  featured?: boolean;
  isActive?: boolean;
  image?: File;
}