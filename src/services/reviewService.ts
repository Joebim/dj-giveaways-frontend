import api from "./api";
import { unwrapResponse } from "./http";
import type { Review, CreateReviewRequest } from "../types";

interface ReviewListPayload {
  reviews: Review[];
}

interface ReviewPayload {
  review: Review;
}

class ReviewService {
  async getReviews(params?: { page?: number; limit?: number; verified?: boolean }) {
    const response = await api.get<ReviewListPayload>("/reviews", { params });
    const { data, meta } = unwrapResponse<ReviewListPayload>(response);
    return {
      reviews: data?.reviews ?? [],
      meta,
    };
  }

  async createReview(payload: CreateReviewRequest) {
    const response = await api.post<ReviewPayload>("/reviews", payload);
    const { data } = unwrapResponse<ReviewPayload>(response);
    return data.review;
  }
}

const reviewService = new ReviewService();

export default reviewService;

