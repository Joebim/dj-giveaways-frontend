import api from "./api";
import { unwrapResponse } from "./http";
import type {
  AdminUserListResponse,
  Champion,
  CreateChampionRequest,
  CreateDrawRequest,
  Draw,
  UpdateChampionRequest,
  UpdateDrawRequest,
} from "../types";

interface DrawListPayload {
  draws: Array<Record<string, any>>;
}

interface DrawPayload {
  draw: Record<string, any>;
}

interface ChampionListPayload {
  champions: Array<Record<string, any>>;
}

interface ChampionPayload {
  champion: Record<string, any>;
}

const ADMIN_DRAWS_BASE = "/admin/draws";
const ADMIN_CHAMPIONS_BASE = "/admin/champions";

const normalizeDraw = (draw: Record<string, any>): Draw => ({
  id: draw.id || draw._id,
  competitionId:
    (draw.competitionId && draw.competitionId._id) || draw.competitionId || "",
  competitionTitle:
    draw.competitionTitle || draw.competitionId?.title || draw.prizeName,
  prizeName: draw.prizeName,
  prizeValue:
    draw.prizeValue !== undefined ? Number(draw.prizeValue) : undefined,
  winnerId:
    (draw.winnerId && draw.winnerId._id) || draw.winnerId || undefined,
  winnerName:
    draw.winnerName ||
    [
      draw.winnerId?.firstName ?? "",
      draw.winnerId?.lastName ?? "",
    ]
      .join(" ")
      .trim(),
  winnerLocation: draw.winnerLocation,
  drawDate: draw.drawDate,
  drawnAt: draw.drawnAt,
  totalTickets: Number(draw.totalTickets || 0),
  winningTicketNumber: Number(draw.winningTicketNumber || 0),
  imageUrl: draw.imageUrl,
  publicId: draw.publicId,
  isActive: Boolean(draw.isActive ?? true),
  createdAt: draw.createdAt,
  updatedAt: draw.updatedAt,
});

const normalizeChampion = (champion: Record<string, any>): Champion => ({
  id: champion.id || champion._id,
  drawId:
    (champion.drawId && champion.drawId._id) || champion.drawId || undefined,
  competitionId:
    (champion.competitionId && champion.competitionId._id) ||
    champion.competitionId ||
    "",
  competitionTitle:
    champion.competitionTitle || champion.competitionId?.title || undefined,
  winnerId:
    (champion.winnerId && champion.winnerId._id) ||
    champion.winnerId ||
    undefined,
  winnerName:
    champion.winnerName ||
    [
      champion.winnerId?.firstName ?? "",
      champion.winnerId?.lastName ?? "",
    ]
      .join(" ")
      .trim(),
  winnerLocation: champion.winnerLocation,
  prizeName: champion.prizeName,
  prizeValue: champion.prizeValue,
  testimonial: champion.testimonial,
  image: champion.image,
  featured: Boolean(champion.featured),
  isActive: Boolean(champion.isActive ?? true),
  createdAt: champion.createdAt,
  updatedAt: champion.updatedAt,
});

class AdminApiClient {
  async getDraws(params?: {
    page?: number;
    limit?: number;
    competitionId?: string;
    winnerId?: string;
  }) {
    const response = await api.get<DrawListPayload>(ADMIN_DRAWS_BASE, {
      params,
    });
    const { data, meta } = unwrapResponse<DrawListPayload>(response);
    return {
      draws: (data?.draws ?? []).map(normalizeDraw),
      meta,
    };
  }

  async getDrawById(id: string) {
    const response = await api.get<DrawPayload>(`${ADMIN_DRAWS_BASE}/${id}`);
    const { data } = unwrapResponse<DrawPayload>(response);
    return normalizeDraw(data.draw);
  }

  async createDraw(payload: CreateDrawRequest) {
    const response = await api.post<DrawPayload>(ADMIN_DRAWS_BASE, payload);
    const { data } = unwrapResponse<DrawPayload>(response);
    return normalizeDraw(data.draw);
  }

  async updateDraw(id: string, payload: UpdateDrawRequest) {
    const response = await api.put<DrawPayload>(
      `${ADMIN_DRAWS_BASE}/${id}`,
      payload
    );
    const { data } = unwrapResponse<DrawPayload>(response);
    return normalizeDraw(data.draw);
  }

  async deleteDraw(id: string) {
    await api.delete(`${ADMIN_DRAWS_BASE}/${id}`);
  }

  async getChampions(params?: {
    page?: number;
    limit?: number;
    featured?: boolean;
    search?: string;
  }) {
    const response = await api.get<ChampionListPayload>(ADMIN_CHAMPIONS_BASE, {
      params,
    });
    const { data, meta } = unwrapResponse<ChampionListPayload>(response);
    return {
      champions: (data?.champions ?? []).map(normalizeChampion),
      meta,
    };
  }

  async getChampionById(id: string) {
    const response = await api.get<ChampionPayload>(
      `${ADMIN_CHAMPIONS_BASE}/${id}`
    );
    const { data } = unwrapResponse<ChampionPayload>(response);
    return normalizeChampion(data.champion);
  }

  async createChampion(payload: CreateChampionRequest) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const response = await api.post<ChampionPayload>(
      ADMIN_CHAMPIONS_BASE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { data } = unwrapResponse<ChampionPayload>(response);
    return normalizeChampion(data.champion);
  }

  async updateChampion(id: string, payload: UpdateChampionRequest) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const response = await api.put<ChampionPayload>(
      `${ADMIN_CHAMPIONS_BASE}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { data } = unwrapResponse<ChampionPayload>(response);
    return normalizeChampion(data.champion);
  }

  async deleteChampion(id: string) {
    await api.delete(`${ADMIN_CHAMPIONS_BASE}/${id}`);
  }
  async getUsersSummary(params?: { limit?: number }) {
    const response = await api.get<AdminUserListResponse>("/admin/users", {
      params,
    });
    const { data } = unwrapResponse<AdminUserListResponse>(response);
    return {
      users: data?.users ?? [],
      total: data?.users?.length ?? 0,
    };
  }
}

const adminService = new AdminApiClient();

export default adminService;
