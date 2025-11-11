import api from "./api";
import { unwrapResponse } from "./http";
import type { Draw } from "../types";

interface DrawListPayload {
  draws: Array<Record<string, any>>;
}

const normalizeDraw = (draw: Record<string, any>): Draw => {
  const competition =
    typeof draw.competitionId === "object" && draw.competitionId !== null
      ? draw.competitionId
      : undefined;
  const winner =
    typeof draw.winnerId === "object" && draw.winnerId !== null
      ? draw.winnerId
      : undefined;

  return {
    id: draw.id || draw._id,
    competitionId:
      (competition?._id as string) || (draw.competitionId as string) || "",
    competitionTitle:
      draw.competitionTitle || competition?.title || draw.prizeName,
    prizeName: draw.prizeName,
    prizeValue:
      draw.prizeValue !== undefined ? Number(draw.prizeValue) : undefined,
    winnerId: (winner?._id as string) || (draw.winnerId as string) || undefined,
    winnerName: draw.winnerName || `${winner?.firstName ?? ""} ${winner?.lastName ?? ""}`.trim(),
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
  };
};

class DrawService {
  async getDraws(params?: {
    page?: number;
    limit?: number;
    competitionId?: string;
  }) {
    const response = await api.get<DrawListPayload>("/draws", { params });
    const { data, meta } = unwrapResponse<DrawListPayload>(response);

    return {
      draws: (data?.draws ?? []).map(normalizeDraw),
      meta,
    };
  }

  async getRecentDraws(limit = 6) {
    const response = await api.get<DrawListPayload>("/draws/recent", {
      params: { limit },
    });
    const { data } = unwrapResponse<DrawListPayload>(response);
    return (data?.draws ?? []).map(normalizeDraw);
  }
}

export default new DrawService();
