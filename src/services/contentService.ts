// import api from "./api";
// import { unwrapResponse } from "./http";
import type {
  FAQResponse,
  HomeContent,
  LegalPageContent,
} from "../types";
import { DUMMY_HOME_CONTENT } from "../data/dummyData";

class ContentService {
  async getPage(slug: string): Promise<LegalPageContent> {
    // Commented out for dummy data
    // const response = await api.get<ContentPageResponse>(
    //   `/content/pages/${slug}`
    // );
    // const { data } = unwrapResponse<ContentPageResponse>(response);

    // if (data?.page) {
    //   return data.page;
    // }

    // throw new Error("Page content missing");
    
    // Return dummy data structure
    return {
      slug,
      title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      subtitle: `Content for ${slug}`,
      sections: [],
    };
  }

  async getFaqs(): Promise<FAQResponse> {
    // Commented out for dummy data
    // const response = await api.get<FAQResponse>("/content/faqs");
    // const { data } = unwrapResponse<FAQResponse>(response);

    // if (data?.faqs) {
    //   return data;
    // }

    // throw new Error("FAQ content missing");
    
    // Return dummy data
    return {
      faqs: [
        {
          id: "1",
          question: "How do I enter a competition?",
          answer: "Simply browse our competitions, select one you like, answer the skill-based question, and purchase your tickets.",
        },
        {
          id: "2",
          question: "When are draws held?",
          answer: "Draw dates vary by competition. Each competition page displays the exact draw date and time.",
        },
        {
          id: "3",
          question: "How will I know if I've won?",
          answer: "Winners are contacted directly via phone and email immediately after the draw. We also publish winners on our website.",
        },
      ],
    };
  }

  async getHomeContent(): Promise<HomeContent> {
    // Commented out for dummy data
    // const response = await api.get<HomeContent>("/content/home");
    // const { data } = unwrapResponse<HomeContent>(response);
    // return data;
    
    // Return dummy data
    return DUMMY_HOME_CONTENT as HomeContent;
  }
}

const contentService = new ContentService();

export default contentService;
