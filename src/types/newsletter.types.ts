export type NewsletterStatus = "subscribed" | "unsubscribed";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: NewsletterStatus;
  source?: string;
  subscribedAt?: string;
  unsubscribedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsletterSubscribeRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
}

export interface NewsletterUnsubscribeRequest {
  email: string;
}

export interface NewsletterStats {
  totalSubscribers: number;
  totalUnsubscribed: number;
  recentSubscribers: NewsletterSubscriber[];
}

