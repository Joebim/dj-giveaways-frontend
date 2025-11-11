import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaUsers, FaHeart, FaStar } from "react-icons/fa";
import { PiTrophyFill } from "react-icons/pi";
import { MdOutlineAttachMoney } from "react-icons/md";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import CompetitionCard from "../../components/home/CompetitionCard";
import ChampionCard from "../../components/home/ChampionCard";
import ReviewCard from "../../components/home/ReviewCard";
import RecentDrawCard from "../../components/home/RecentDrawCard";
import HeroSlideshow from "../../components/home/HeroSlideshow";
import { contentService } from "../../services";

const baseIconClasses = "w-8 h-8 text-gold-primary";

const STAT_ICONS: Record<string, React.ReactNode> = {
  trophy: <PiTrophyFill className={baseIconClasses} />,
  competitions: <PiTrophyFill className={baseIconClasses} />,
  winners: <FaUsers className={baseIconClasses} />,
  draws: <FaUsers className={baseIconClasses} />,
  champions: <FaHeart className={baseIconClasses} />,
  entries: <FaUsers className={baseIconClasses} />,
  ticketSales: <MdOutlineAttachMoney className={baseIconClasses} />,
  revenue: <MdOutlineAttachMoney className={baseIconClasses} />,
  money: <MdOutlineAttachMoney className={baseIconClasses} />,
  heart: <FaHeart className={baseIconClasses} />,
  users: <FaUsers className={baseIconClasses} />,
};

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/dtaegi6gk/image/upload/v1761794213/2197_zwopny.jpg";

const Home: React.FC = () => {
  const [championsCarouselApi, setChampionsCarouselApi] =
    useState<ReturnType<typeof useEmblaCarousel>[1] | null>(null);

  const {
    data: homeContent,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["content", "home"],
    queryFn: () => contentService.getHomeContent(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Unable to load latest home content. Showing cached data.");
    }
  }, [isError]);

  useEffect(() => {
    if (!championsCarouselApi) return;

    const interval = setInterval(() => {
      if (championsCarouselApi.canScrollNext()) {
        championsCarouselApi.scrollNext();
      } else {
        championsCarouselApi.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [championsCarouselApi]);

  const competitions = useMemo(() => {
    return (
      homeContent?.competitions.map((competition) => ({
        id: competition.id,
        title: competition.title,
        image: competition.image ?? FALLBACK_IMAGE,
        price: Number(competition.ticketPrice || 0),
        soldTickets: Number(competition.progress?.soldTickets ?? competition.soldTickets ?? 0),
        maxTickets: Number(competition.progress?.maxTickets ?? competition.maxTickets ?? 0),
        progress: Number(competition.progress?.percentage ?? 0),
      })) ?? []
    );
  }, [homeContent]);

  // Featured competitions for hero slideshow (first 3-5 competitions)
  const featuredCompetitions = useMemo(() => {
    return competitions.slice(0, 5).map((comp) => ({
      id: comp.id,
      title: comp.title,
      image: comp.image,
      price: comp.price,
      soldTickets: comp.soldTickets,
      maxTickets: comp.maxTickets,
      description: `Win this amazing prize! Only £${comp.price.toFixed(2)} per ticket.`,
    }));
  }, [competitions]);

  const champions = useMemo(() => {
    return (
      homeContent?.champions.map((champion) => ({
        id: champion.id,
        name: champion.winnerName,
        image: champion.image ?? FALLBACK_IMAGE,
        quote: champion.testimonial,
      })) ?? []
    );
  }, [homeContent]);

  const stats = homeContent?.stats ?? [];

  const reviews = useMemo(() => {
    return (
      homeContent?.reviews.map((review) => ({
        id: typeof review.id === "string" ? review.id : String(review.id),
        title: review.title,
        body: review.body,
        rating: review.rating,
        reviewer: review.reviewer,
        timeAgo: review.timeAgo ?? "",
        verified: Boolean(review.verified),
      })) ?? []
    );
  }, [homeContent]);

  const recentDraws = useMemo(() => {
    return (
      homeContent?.recentDraws.map((draw) => ({
        id: typeof draw.id === "string" ? draw.id : String(draw.id),
        winner: draw.winner,
        location: draw.location,
        prize: draw.prize,
        prizeValue: draw.prizeValue,
        ticketNumber: String(draw.ticketNumber ?? ""),
        drawDate: draw.drawDate,
        image: draw.image ?? FALLBACK_IMAGE,
      })) ?? []
    );
  }, [homeContent]);

  const getStatIcon = (key: string | undefined, label?: string) => {
    const normalizedKey = (key ?? "").toLowerCase();
    if (normalizedKey && STAT_ICONS[normalizedKey]) {
      return STAT_ICONS[normalizedKey];
    }
    const normalizedLabel = (label ?? "").toLowerCase();
    if (normalizedLabel && STAT_ICONS[normalizedLabel]) {
      return STAT_ICONS[normalizedLabel];
    }
    return <FaStar className={baseIconClasses} />;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Slideshow */}
      {featuredCompetitions.length > 0 && (
        <HeroSlideshow competitions={featuredCompetitions} />
      )}

      <section className="py-[80px] bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-navy-light mb-4 tracking-tight">
              Our <span className="text-gold-primary gold-text-glow">Live</span> Competitions
            </h2>
            <p className="text-navy-primary text-sm font-medium tracking-wide uppercase">
              Premium Prizes Await
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[420px] rounded-xl border border-gold-primary/30 bg-black-soft animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {competitions.map((competition, index) => (
                <motion.div
                  key={competition.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CompetitionCard competition={competition} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-[80px] bg-black-soft">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs text-gold-primary font-semibold mb-3 uppercase tracking-widest gold-text-glow">
              From all over UK & Ireland
            </p>
            <h2 className="text-4xl font-bold text-navy-light tracking-tight">
              Our <span className="text-gold-primary gold-text-glow">Champions</span>
            </h2>
          </motion.div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setChampionsCarouselApi}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {champions.map((champion) => (
                <CarouselItem
                  key={champion.id}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <ChampionCard champion={champion} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <section className="py-[100px] bg-black border-t border-gold-primary/30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 bg-black-soft border border-gold-primary/30 rounded-lg overflow-hidden gold-border-glow">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.key ?? index}
                className={`text-center px-6 py-16 ${index !== stats.length - 1
                  ? "border-r border-gold-primary/20"
                  : ""
                  } hover:bg-gold-primary/10 transition-all duration-300 group`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gold-primary/20 border border-gold-primary/50 flex items-center justify-center group-hover:bg-gold-primary/30 transition-all duration-300 gold-hover-glow">
                    {getStatIcon(stat.key, stat.label)}
                  </div>
                </div>
                <div className="text-5xl font-bold text-gold-primary mb-3 group-hover:scale-110 transition-transform duration-300 gold-text-glow">
                  {stat.value}
                </div>
                <p className="text-navy-primary font-medium uppercase tracking-widest text-xs">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {recentDraws.length > 0 && (
        <section className="py-[80px] bg-black-soft border-t border-gold-primary/30">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold mb-3 uppercase tracking-widest neon-orange-text" style={{ color: '#FF9500' }}>
                Fresh off the live draw
              </p>
              <h2 className="text-4xl font-bold text-navy-light tracking-tight">
                Latest <span className="text-gold-primary gold-text-glow">Winners</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentDraws.map((draw, index) => (
                <motion.div
                  key={draw.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <RecentDrawCard draw={draw} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-[100px] bg-black border-t border-gold-primary/30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-navy-light mb-4 tracking-tight">
              We are <span className="text-gold-primary gold-text-glow">Trusted</span>
            </h2>
            <p className="text-navy-primary text-sm font-medium tracking-wide uppercase">
              Customer Reviews
            </p>
          </motion.div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {reviews.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <ReviewCard review={review} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-navy-primary text-sm font-medium mb-2">
              Rated <span className="font-bold text-navy-light">4.8</span> / 5 by
              our champions. Showing verified five star reviews.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4 text-gold-primary fill-current" />
                ))}
              </div>
              <span className="text-gold-primary font-semibold text-sm">
                Trustpilot
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
