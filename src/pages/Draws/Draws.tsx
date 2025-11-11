import React from "react";
// import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import toast from "react-hot-toast";
import RecentDrawCard, {
  type RecentDrawCardData,
} from "../../components/home/RecentDrawCard";
// import type { Draw } from "../../types";
// import { drawService } from "../../services";
import { DUMMY_RECENT_DRAWS } from "../../data/dummyData";

// Commented out API call - using dummy data
// type DrawsQueryResult = Awaited<ReturnType<typeof drawService.getDraws>>;

const Draws: React.FC = () => {
  const [page, setPage] = React.useState(1);

  // Commented out API call
  // const { data, isLoading, isError, isFetching } = useQuery<DrawsQueryResult>({
  //   queryKey: ["draws", "public", page, limit],
  //   queryFn: () => drawService.getDraws({ page, limit }),
  //   retry: 1,
  //   staleTime: 60 * 1000,
  //   placeholderData: (previousData) => previousData,
  // });

  // Use dummy data
  const draws: RecentDrawCardData[] = DUMMY_RECENT_DRAWS.map((draw) => ({
    id: draw.id,
    winner: draw.winner,
    location: draw.location,
    prize: draw.prize,
    prizeValue: draw.prizeValue,
    ticketNumber: draw.ticketNumber,
    drawDate: draw.drawDate,
    image: draw.image,
  }));

  const isLoading = false;
  const isFetching = false;
  const totalPages = 1;

  // Commented out error toast
  // React.useEffect(() => {
  //   if (isError) {
  //     toast.error("Unable to load live draw data. Showing the latest showcase instead.");
  //   }
  // }, [isError]);


  return (
    <div className="min-h-screen bg-black">
      <section className="py-32 bg-black-soft border-b border-gold-primary/30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-navy-light mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Recent <span className="text-gold-primary gold-text-glow">Draws</span>
          </motion.h1>
          <motion.p
            className="text-xl text-navy-primary font-medium max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Catch up on the latest winners and prize reveals from DJ Giveaways. We keep this list updated as soon as new draws go live.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-[340px] bg-black-soft border border-gold-primary/30 rounded-xl animate-pulse"
                >
                  <div className="h-48 bg-black/50 rounded-t-xl" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 w-3/4 bg-black/50 rounded" />
                    <div className="h-4 w-1/2 bg-black/50 rounded" />
                    <div className="h-4 w-full bg-black/30 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : draws.length === 0 ? (
            <div className="bg-black-soft border border-gold-primary/30 rounded-xl p-12 text-center">
              <p className="text-navy-primary text-lg font-medium">
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

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-12">
                  <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1 || isFetching}
                    className="flex items-center gap-2 px-5 py-3 rounded-full border border-gold-primary/30 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FaArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <p className="text-navy-primary font-medium">
                    Page <span className="text-gold-primary">{page}</span> of{" "}
                    <span className="text-gold-primary">{totalPages}</span>
                  </p>
                  <button
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page >= totalPages || isFetching}
                    className="flex items-center gap-2 px-5 py-3 rounded-full border border-gold-primary/30 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                    <FaArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Draws;

