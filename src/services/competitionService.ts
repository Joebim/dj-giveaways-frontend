import api from "./api";
import { unwrapResponse } from "./http";
import type {
  Competition,
  CompetitionEntry,
  CompetitionFilters,
  CompetitionProgress,
  CompetitionStatus,
} from "../types";

interface CompetitionListParams extends CompetitionFilters {
  page?: number;
  limit?: number;
  sort?: string;
  priceMin?: number;
  priceMax?: number;
  prizeMin?: number;
  prizeMax?: number;
  active?: boolean;
  ids?: string | string[];
}

interface CompetitionListPayload {
  competitions: Competition[];
}

interface CompetitionProgressPayload {
  progress: CompetitionProgress;
  status: string;
  drawDate: string;
}

interface CompetitionEntriesPayload {
  entries: CompetitionEntry[];
}

type RawCompetition = Record<string, any>;

const ADMIN_BASE = "/admin/competitions";

const mapStatus = (status?: string): CompetitionStatus => {
  switch (status) {
    case "active":
      return "active";
    case "drawing":
      return "drawing";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    case "draft":
      return "draft";
    default:
      return "upcoming";
  }
};

const normalizeCompetition = (competition: RawCompetition): Competition => {
  const rawImages = Array.isArray(competition.images)
    ? competition.images
    : [];

  const images = rawImages
    .map((img: any) => {
      if (!img) {
        return undefined;
      }
      if (typeof img === "string") {
        return { url: img } as Competition["images"][number];
      }
      if (typeof img === "object") {
        return {
          url: img.url || img.secure_url || "",
          publicId: img.publicId || img.public_id,
          thumbnail: img.thumbnail || img.thumbUrl || img.thumbnailUrl,
        } as Competition["images"][number];
      }
      return undefined;
    })
    .filter((img): img is Competition["images"][number] => Boolean(img));

  const rawQuestion =
    (competition.question &&
      typeof competition.question === "object" &&
      !Array.isArray(competition.question)
      ? competition.question
      : {}) as Record<string, any>;
  const rawOptions =
    rawQuestion.options ??
    (competition as Record<string, any>).answerOptions ??
    (competition as Record<string, any>).options ??
    [];

  const question: Competition["question"] = {
    question:
      rawQuestion.question ??
      rawQuestion.prompt ??
      (competition as Record<string, any>).questionPrompt ??
      (competition as Record<string, any>).question ??
      "",
    options: Array.isArray(rawOptions)
      ? rawOptions.map((opt: any) => String(opt))
      : [],
    correctAnswer:
      rawQuestion.correctAnswer ??
      (competition as Record<string, any>).correctAnswer ??
      undefined,
    explanation:
      rawQuestion.explanation ??
      (competition as Record<string, any>).explanation ??
      undefined,
  };

  const progress =
    competition.progress && typeof competition.progress === "object"
      ? {
          soldTickets: Number(competition.progress.soldTickets) || 0,
          maxTickets: Number(competition.progress.maxTickets) || 0,
          entriesRemaining:
            Number(competition.progress.entriesRemaining) ??
            Math.max(
              Number(competition.maxTickets || 0) -
                Number(competition.soldTickets || 0),
              0
            ),
          percentage:
            Number(competition.progress.percentage) ??
            (competition.maxTickets
              ? Math.round(
                  (Number(competition.soldTickets || 0) /
                    Number(competition.maxTickets || 1)) *
                    100
                )
              : 0),
        }
      : undefined;

  return {
    id: competition.id || competition._id,
    slug: competition.slug,
    title: competition.title,
    description: competition.description,
    shortDescription: competition.shortDescription,
    prize: competition.prize,
    prizeValue:
      competition.prizeValue !== undefined
        ? Number(competition.prizeValue)
        : undefined,
    cashAlternative:
      competition.cashAlternative !== undefined
        ? Number(competition.cashAlternative)
        : undefined,
    cashAlternativeDetails: competition.cashAlternativeDetails,
    originalPrice:
      competition.originalPrice !== undefined
        ? Number(competition.originalPrice)
        : undefined,
    ticketPrice: Number(competition.ticketPrice),
    maxTickets: Number(competition.maxTickets),
    soldTickets: Number(competition.soldTickets),
    drawDate: competition.drawDate,
    endDate: competition.endDate,
    startDate: competition.startDate,
    status: mapStatus(competition.status),
    category: competition.category,
    images,
    featured: Boolean(competition.featured),
    isActive:
      competition.isActive !== undefined
        ? Boolean(competition.isActive)
        : true,
    isGuaranteedDraw:
      competition.isGuaranteedDraw !== undefined
        ? Boolean(competition.isGuaranteedDraw)
        : undefined,
    features: competition.features ?? undefined,
    included: competition.included ?? undefined,
    specifications: competition.specifications ?? undefined,
    tags: competition.tags ?? undefined,
    termsAndConditions: competition.termsAndConditions,
    question,
    progress,
    createdAt: competition.createdAt,
    updatedAt: competition.updatedAt,
  };
};

const competitionService = {
  async getCompetitions(params: CompetitionListParams = {}) {
    const response = await api.get<CompetitionListPayload>("/competitions", {
      params,
    });

    const { data, meta } = unwrapResponse<CompetitionListPayload>(response);

    return {
      competitions: (data?.competitions ?? []).map(normalizeCompetition),
      meta,
    };
  },

  async getFeaturedCompetitions() {
    const response = await api.get<CompetitionListPayload>(
      "/competitions/featured"
    );
    const { data } = unwrapResponse<CompetitionListPayload>(response);
    return (data?.competitions ?? []).map(normalizeCompetition);
  },

  async getCompetitionById(id: string, options?: { admin?: boolean }) {
    const path = options?.admin ? `${ADMIN_BASE}/${id}` : `/competitions/${id}`;
    const response = await api.get<{ competition: RawCompetition }>(path);
    const { data } = unwrapResponse<{ competition: RawCompetition }>(response);
    return normalizeCompetition(data.competition);
  },

  async getCompetitionProgress(id: string) {
    const response = await api.get<CompetitionProgressPayload>(
      `/competitions/${id}/progress`
    );
    const { data } = unwrapResponse<CompetitionProgressPayload>(response);
    return {
      ...data.progress,
      status: mapStatus(data.status),
      drawDate: data.drawDate,
    };
  },

  async validateEntryAnswer(id: string, answer: string) {
    const response = await api.post<{ isCorrect: boolean }>(
      `/competitions/${id}/entries/validate-answer`,
      { answer }
    );
    const { data } = unwrapResponse<{ isCorrect: boolean }>(response);
    return data.isCorrect;
  },

  // ========================
  // Admin endpoints
  // ========================

  async getAdminCompetitions(params: CompetitionListParams = {}) {
    const response = await api.get<CompetitionListPayload>(ADMIN_BASE, {
      params,
    });
    const { data, meta } = unwrapResponse<CompetitionListPayload>(response);
    return {
      competitions: (data?.competitions ?? []).map(normalizeCompetition),
      meta,
    };
  },

  async createCompetition(formData: FormData) {
    const response = await api.post<{ competition: RawCompetition }>(
      ADMIN_BASE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { data } = unwrapResponse<{ competition: RawCompetition }>(response);
    return normalizeCompetition(data.competition);
  },

  async updateCompetition(id: string, formData: FormData) {
    const response = await api.put<{ competition: RawCompetition }>(
      `${ADMIN_BASE}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { data } = unwrapResponse<{ competition: RawCompetition }>(response);
    return normalizeCompetition(data.competition);
  },

  async updateCompetitionStatus(id: string, status: string) {
    const response = await api.patch<{ competition: RawCompetition }>(
      `${ADMIN_BASE}/${id}/status`,
      { status }
    );
    const { data } = unwrapResponse<{ competition: RawCompetition }>(response);
    return normalizeCompetition(data.competition);
  },

  async deleteCompetition(id: string) {
    await api.delete(`${ADMIN_BASE}/${id}`);
  },

  async getCompetitionEntries(id: string, params?: { page?: number; limit?: number }) {
    const response = await api.get<CompetitionEntriesPayload>(
      `${ADMIN_BASE}/${id}/entries`,
      { params }
    );
    const { data, meta } = unwrapResponse<CompetitionEntriesPayload>(response);
    return {
      entries: data.entries?.map((entry) => ({
        ...entry,
        createdAt: entry.createdAt,
      })) ?? [],
      meta,
    };
  },
};

export default competitionService;

