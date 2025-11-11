export type CompetitionStatus =
  | "draft"
  | "upcoming"
  | "active"
  | "drawing"
  | "completed"
  | "ended"
  | "drawn"
  | "cancelled";

export type CompetitionCategory =
  | "Luxury Cars"
  | "Tech & Gadgets"
  | "Holidays"
  | "Cash Prizes"
  | "Home & Garden"
  | "Fashion & Watches"
  | "Experiences"
  | "Other";

export interface CompetitionProgress {
  soldTickets: number;
  maxTickets: number;
  entriesRemaining: number;
  percentage: number;
}

export interface CompetitionSpec {
  label: string;
  value: string;
}

export interface CompetitionImage {
  url: string;
  publicId?: string;
  thumbnail?: string;
}

export interface CompetitionQuestion {
  question: string;
  options: string[];
  correctAnswer?: string;
  explanation?: string;
}

export interface Competition {
  id: string;
  slug?: string;
  title: string;
  description: string;
  shortDescription?: string;
  prize: string;
  prizeValue?: number;
  cashAlternative?: number;
  cashAlternativeDetails?: string;
  originalPrice?: number;
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
  drawDate: string;
  endDate?: string;
  startDate?: string;
  status: CompetitionStatus;
  category: CompetitionCategory;
  images: CompetitionImage[];
  featured: boolean;
  isActive: boolean;
  isGuaranteedDraw?: boolean;
  features?: string[];
  included?: string[];
  specifications?: CompetitionSpec[];
  tags?: string[];
  termsAndConditions?: string;
  question: CompetitionQuestion;
  progress?: CompetitionProgress;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionFilters {
  category?: CompetitionCategory;
  status?: CompetitionStatus;
  priceRange?: {
    min: number;
    max: number;
  };
  prizeRange?: {
    min: number;
    max: number;
  };
  featured?: boolean;
  search?: string;
}

export interface CompetitionEntry {
  id: string;
  competitionId: string;
  userId: string;
  ticketNumber: number;
  answer: string;
  isCorrect: boolean;
  createdAt: string;
}
