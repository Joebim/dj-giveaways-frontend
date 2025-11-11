export interface Review {
  id: string;
  title: string;
  body: string;
  rating: number;
  reviewer: string;
  location?: string;
  verified: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  title: string;
  body: string;
  rating: number;
  reviewer: string;
  location?: string;
}

