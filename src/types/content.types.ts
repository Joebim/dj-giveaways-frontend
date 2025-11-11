export interface LegalSection {
  heading: string;
  body: string[];
  list?: {
    title?: string;
    items: string[];
  };
}

export interface LegalPageContent {
  slug: string;
  title: string;
  subtitle?: string;
  updatedAt?: string;
  sections: LegalSection[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQResponse {
  faqs: FAQItem[];
}

export interface ContentPageResponse {
  page: LegalPageContent;
}

export interface HomeHero {
  image: string | null;
  alt?: string | null;
}

export interface HomeCompetitionCard {
  id: string;
  title: string;
  slug?: string;
  image?: string | null;
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
  drawDate?: string;
  category?: string;
  featured?: boolean;
  progress?: {
    soldTickets: number;
    maxTickets: number;
    entriesRemaining: number;
    percentage: number;
  };
}

export interface HomeChampionCard {
  id: string;
  winnerName: string;
  winnerLocation: string;
  prizeName: string;
  prizeValue?: string;
  testimonial: string;
  image?: string | null;
  featured?: boolean;
}

export interface HomeDrawCard {
  id: string;
  winner: string;
  location: string;
  prize: string;
  prizeValue?: string;
  ticketNumber: number;
  drawDate: string;
  image?: string | null;
}

export interface HomeReviewCard {
  id: string;
  title: string;
  body: string;
  rating: number;
  reviewer: string;
  location?: string;
  timeAgo?: string;
  verified?: boolean;
}

export interface HomeStat {
  key: string;
  label: string;
  value: string;
  description?: string;
}

export interface HomeContent {
  hero: HomeHero | null;
  competitions: HomeCompetitionCard[];
  champions: HomeChampionCard[];
  stats: HomeStat[];
  recentDraws: HomeDrawCard[];
  reviews: HomeReviewCard[];
}


