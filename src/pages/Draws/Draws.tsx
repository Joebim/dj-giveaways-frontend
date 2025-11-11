import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";
import RecentDrawCard, {
  type RecentDrawCardData,
} from "../../components/home/RecentDrawCard";
import type { Draw } from "../../types";
import homeData from "../../data/homeData.json";
import { drawService } from "../../services";

const FALLBACK_LIMIT = 6;

const transformDraw = (draw: Draw): RecentDrawCardData => ({
  id: draw.id,
  winner: draw.winnerName,
  location: draw.winnerLocation,
  prize: draw.prizeName ?? draw.competitionTitle ?? "Competition Prize",
  prizeValue:
    draw.prizeValue !== undefined
      ? `£${Number(draw.prizeValue).toLocaleString()}`
      : undefined,
  ticketNumber: String(draw.winningTicketNumber ?? ""),
  drawDate: draw.drawDate,
  image: draw.imageUrl ?? "https://via.placeholder.com/640x480?text=Royal+Competitions",
});

const fallbackDraws: RecentDrawCardData[] = homeData.recentDraws.map(
  (draw, index) => ({
    id: draw.id ? String(draw.id) : `fallback-${index}`,
    winner: draw.winner,
    location: draw.location,
    prize: draw.prize,
    prizeValue: draw.prizeValue,
    ticketNumber: draw.ticketNumber,
    drawDate: draw.drawDate,
    image: draw.image,
  })
);

type DrawsQueryResult = Awaited<ReturnType<typeof drawService.getDraws>>;

const Draws: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(9);

  const { data, isLoading, isError, isFetching } = useQuery<DrawsQueryResult>({
    queryKey: ["draws", "public", page, limit],
    queryFn: () => drawService.getDraws({ page, limit }),
    retry: 1,
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const draws =
    data?.draws?.map((draw) => transformDraw(draw)) ??
    fallbackDraws.slice(
      (page - 1) * FALLBACK_LIMIT,
      (page - 1) * FALLBACK_LIMIT + FALLBACK_LIMIT
    );

  const pagination = (data?.meta?.pagination ?? {}) as {
    page?: number;
    totalPages?: number;
  };

  const totalPages =
    pagination.totalPages ?? Math.max(1, Math.ceil(fallbackDraws.length / FALLBACK_LIMIT));

  React.useEffect(() => {
    if (isError) {
      toast.error("Unable to load live draw data. Showing the latest showcase instead.");
    }
  }, [isError]);

  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <div className="min-h-screen bg-white">
      <section className="py-32 bg-gray-50 border-b border-gold-primary/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-light text-navy-primary mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Recent Draws
          </motion.h1>
          <motion.p
            className="text-xl text-gray-700 font-light max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Catch up on the latest winners and prize reveals from DJ Giveaways. We keep this list updated as soon as new draws go live.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {isLoading && !data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-[340px] bg-gray-50 border border-gold-primary/20 rounded-xl animate-pulse"
                >
                  <div className="h-48 bg-white/10 rounded-t-xl" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 w-3/4 bg-white/10 rounded" />
                    <div className="h-4 w-1/2 bg-white/10 rounded" />
                    <div className="h-4 w-full bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : draws.length === 0 ? (
            <div className="bg-gray-50 border border-gold-primary/20 rounded-xl p-12 text-center">
              <p className="text-gray-700 text-lg font-light">
                No draws have been published yet. Check back soon for our latest winners.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {draws.map((draw, index) => (
                  <RecentDrawCard key={`${draw.id}-${index}`} draw={draw} />
                ))}
              </div>

              <div className="flex items-center justify-between mt-12">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={!canGoBack || isFetching}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-gold-primary/30 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <p className="text-gray-600 font-light">
                  Page <span className="text-gold-primary">{page}</span> of{" "}
                  <span className="text-gold-primary">{totalPages}</span>
                </p>
                <button
                  onClick={() => setPage((prev) => (canGoForward ? prev + 1 : prev))}
                  disabled={!canGoForward || isFetching}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-gold-primary/30 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Draws;

