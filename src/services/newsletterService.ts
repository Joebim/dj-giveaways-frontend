import api from "./api";
import { unwrapResponse } from "./http";
import type {
  NewsletterStats,
  NewsletterSubscribeRequest,
  NewsletterSubscriber,
  NewsletterUnsubscribeRequest,
} from "../types";

interface NewsletterPayload {
  subscriber: NewsletterSubscriber;
}

class NewsletterService {
  async subscribe(payload: NewsletterSubscribeRequest) {
    const response = await api.post<NewsletterPayload>(
      "/newsletter/subscribe",
      payload
    );
    const { data } = unwrapResponse<NewsletterPayload>(response);
    return data?.subscriber;
  }

  async unsubscribe(payload: NewsletterUnsubscribeRequest) {
    const response = await api.post("/newsletter/unsubscribe", payload);
    unwrapResponse(response);
  }

  async getStats() {
    const response = await api.get<NewsletterStats>("/newsletter/stats");
    const { data } = unwrapResponse<NewsletterStats>(response);
    return data;
  }
}

const newsletterService = new NewsletterService();

export default newsletterService;

