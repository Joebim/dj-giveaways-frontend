import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import CompetitionCard from "../../components/home/CompetitionCard";
import { competitionService } from "../../services";
import homeData from "../../data/homeData.json";

const FALLBACK_COMPETITIONS = homeData.competitions.map((competition) => ({
  id: String(competition.id),
  title: competition.title,
  image: competition.image,
  price: competition.price,
  soldTickets: competition.soldTickets,
  maxTickets: competition.maxTickets,
  progress: competition.progress,
}));

type CompetitionsQueryResult = Awaited<
  ReturnType<typeof competitionService.getCompetitions>
>;

const CompetitionsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError } = useQuery<CompetitionsQueryResult>({
    queryKey: ["competitions", "public", page, limit],
    queryFn: () => competitionService.getCompetitions({ page, limit }),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const competitions = useMemo(() => {
    if (!data?.competitions?.length) {
      return FALLBACK_COMPETITIONS;
    }

    return data.competitions.map((competition) => ({
      id: competition.id,
      title: competition.title,
      image: competition.images[0]?.url ?? homeData.hero.image,
      price: competition.ticketPrice,
      soldTickets: competition.soldTickets,
      maxTickets: competition.maxTickets,
      progress: competition.progress?.percentage ?? 0,
    }));
  }, [data]);

  const pagination = (data?.meta?.pagination ?? {}) as {
    page?: number;
    totalPages?: number;
  };

  const totalPages = pagination.totalPages ?? 1;

  if (isError) {
    toast.error("Unable to load competitions. Showing cached showcase instead.");
  }

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-light text-white mb-4  tracking-tight">
            Live <span className="text-gold-primary">Competitions</span>
          </h1>
          <p className="text-white/60 text-sm font-light tracking-wide uppercase">
            Browse All Available Competitions
          </p>
        </motion.div>

        {isLoading && !data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] rounded-xl border border-gold-primary/10 bg-black-soft animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competitions.map((competition, index) => (
              <motion.div
                key={competition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <CompetitionCard competition={competition} />
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-5 py-3 rounded-full border border-gold-primary/30 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-white/60 font-light">
              Page <span className="text-gold-primary">{page}</span> of{" "}
              <span className="text-gold-primary">{totalPages}</span>
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="px-5 py-3 rounded-full border border-gold-primary/30 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionsList;
