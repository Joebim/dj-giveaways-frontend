import api from "./api";
import { unwrapResponse } from "./http";
import type {
  ContentPageResponse,
  FAQResponse,
  HomeContent,
  LegalPageContent,
} from "../types";

class ContentService {
  async getPage(slug: string): Promise<LegalPageContent> {
    const response = await api.get<ContentPageResponse>(
      `/content/pages/${slug}`
    );
    const { data } = unwrapResponse<ContentPageResponse>(response);

    if (data?.page) {
      return data.page;
    }

    throw new Error("Page content missing");
  }

  async getFaqs(): Promise<FAQResponse> {
    const response = await api.get<FAQResponse>("/content/faqs");
    const { data } = unwrapResponse<FAQResponse>(response);

    if (data?.faqs) {
      return data;
    }

    throw new Error("FAQ content missing");
  }

  async getHomeContent(): Promise<HomeContent> {
    const response = await api.get<HomeContent>("/content/home");
    const { data } = unwrapResponse<HomeContent>(response);
    return data;
  }
}

const contentService = new ContentService();

export default contentService;
