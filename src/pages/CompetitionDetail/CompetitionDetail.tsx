import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaQuestionCircle,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../components/common/Button/Button";
import { competitionService } from "../../services";
import { useCartStore } from "../../store/useCartStore";

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/dtaegi6gk/image/upload/v1761794213/2197_zwopny.jpg";

const CompetitionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);

  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const {
    data: competition,
    isLoading: isCompetitionLoading,
    isError: isCompetitionError,
    error: competitionError,
  } = useQuery({
    queryKey: ["competition", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Missing competition id");
      }
      return competitionService.getCompetitionById(id);
    },
    enabled: Boolean(id),
    staleTime: 60_000,
  });

  const { data: competitionProgress } = useQuery({
    queryKey: ["competition", id, "progress"],
    queryFn: () => {
      if (!id) {
        throw new Error("Missing competition id");
      }
      return competitionService.getCompetitionProgress(id);
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  });

  const validateAnswerMutation = useMutation({
    mutationFn: async (answer: string) => {
      if (!competition) {
        throw new Error("Competition not loaded");
      }
      return competitionService.validateEntryAnswer(competition.id, answer);
    },
  });

  const drawDateIso = useMemo(
    () => competitionProgress?.drawDate ?? competition?.drawDate ?? null,
    [competition?.drawDate, competitionProgress?.drawDate]
  );

  const images = useMemo(() => {
    if (competition?.images?.length) {
      return competition.images;
    }
    return [{ url: FALLBACK_IMAGE }];
  }, [competition?.images]);

  const currentImage = images[currentImageIndex] ?? images[0];
  const question = competition?.question;
  const answerOptions = question?.options ?? [];

  const soldTickets =
    competitionProgress?.soldTickets ??
    competition?.progress?.soldTickets ??
    competition?.soldTickets ??
    0;
  const maxTickets =
    competitionProgress?.maxTickets ??
    competition?.progress?.maxTickets ??
    competition?.maxTickets ??
    0;
  const progressPercentage =
    competitionProgress?.percentage ??
    (maxTickets ? (soldTickets / maxTickets) * 100 : 0);
  const progressRounded = Math.min(
    Math.max(Number.isFinite(progressPercentage) ? progressPercentage : 0, 0),
    100
  );
  const remainingTickets = Math.max(maxTickets - soldTickets, 0);

  const ticketPrice = competition?.ticketPrice ?? 0;
  const ticketPriceDisplay = ticketPrice.toFixed(2);
  const originalPriceDisplay =
    typeof competition?.originalPrice === "number"
      ? competition.originalPrice.toFixed(2)
      : null;

  const specs = competition?.specifications ?? [];
  const features = competition?.features ?? [];
  const included = competition?.included ?? [];

  const drawBadgeText = useMemo(() => {
    if (!drawDateIso) {
      return null;
    }
    const drawDate = new Date(drawDateIso);
    if (Number.isNaN(drawDate.getTime())) {
      return null;
    }
    const weekday = drawDate.toLocaleDateString("en-GB", { weekday: "long" });
    const day = drawDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    });
    return `Draw ${weekday} ${day}!`.toUpperCase();
  }, [drawDateIso]);

  useEffect(() => {
    if (!drawDateIso) {
      return;
    }

    const calculateTimeLeft = () => {
      const difference = +new Date(drawDateIso) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [drawDateIso]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedAnswer(null);
  }, [competition?.id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const incrementTickets = () => {
    if (ticketQuantity < 20) {
      setTicketQuantity((prev) => prev + 1);
    }
  };

  const decrementTickets = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!competition) {
      toast.error("Competition not found");
      return;
    }
    if (!selectedAnswer) {
      toast.error("Please select an answer first");
      return;
    }

    try {
      const isCorrect = await validateAnswerMutation.mutateAsync(selectedAnswer);
      if (!isCorrect) {
        toast.error("That answer is incorrect. Try again to enter the draw.");
        return;
      }

      await addItem({
        competitionId: competition.id,
        quantity: ticketQuantity,
      });
      toast.success(`${ticketQuantity} ticket(s) added to cart!`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add tickets to cart.";
      toast.error(message);
    }
  };

  const totalPrice = (ticketPrice * ticketQuantity).toFixed(2);
  const isAddToCartDisabled =
    !selectedAnswer || validateAnswerMutation.isPending || isCartLoading;

  if (isCompetitionLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/70 font-light uppercase tracking-[0.3em]">
          Loading competition…
        </p>
      </div>
    );
  }

  if (isCompetitionError || !competition) {
    const message =
      competitionError instanceof Error
        ? competitionError.message
        : "Unable to load competition.";
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4 px-6">
          <h1 className="text-3xl font-light text-white">Competition unavailable</h1>
          <p className="text-white/60">{message}</p>
          <Link
            to="/competitions"
            className="inline-block text-gold-primary hover:text-gold-light font-semibold transition-colors"
          >
            Back to Competitions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Countdown Banner */}
      <section className="bg-black border-b border-gold-primary/10 py-8">
        <div className="max-w-[1267px] mx-auto px-[60px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-light text-white  gold-text-glow">
                {competition.title}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-3">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center bg-gold-primary/10 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[80px] border border-gold-primary/50"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-3xl font-bold text-gold-primary font-['Spectral']">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-gold-primary/90 font-semibold uppercase">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-[60px] bg-black">
        <div className="max-w-[1267px] mx-auto px-[60px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group">
                <div className="relative h-[500px] rounded-lg overflow-hidden bg-gray-900 border border-gold-primary/20">
                  <img
                    src={currentImage?.url ?? FALLBACK_IMAGE}
                    alt={competition.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-gold-primary/90 hover:bg-gold-primary text-navy-primary p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-gold-primary/90 hover:bg-gold-primary text-navy-primary p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
                  >
                    <FaChevronRight className="w-5 h-5" />
                  </button>

                  {/* Draw Date Badge */}
                  <div className="absolute top-4 left-4 bg-gold-primary px-4 py-2 rounded-full shadow-lg border border-gold-primary/50">
                    <p className="text-navy-primary text-sm font-bold uppercase gold-text-glow">
                      {drawBadgeText ?? "LIVE DRAW COMING SOON"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-24 rounded overflow-hidden border-2 transition-all ${idx === currentImageIndex
                      ? 'border-gold-primary gold-border-glow'
                      : 'border-gold-primary/30 hover:border-gold-primary/70'
                      }`}
                  >
                    <img
                      src={image.url}
                      alt={`${competition.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Details & Purchase */}
            <div className="space-y-6">
              {/* Question */}
              <div className="space-y-4 bg-black border border-gold-primary/20 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaQuestionCircle className="w-5 h-5 text-gold-primary" />
                  <h3 className="text-2xl font-light text-white ">
                    {question?.question ?? "Answer the skill-based question"}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {answerOptions.map((answer, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setSelectedAnswer(answer)}
                      className={`px-4 py-3 rounded-lg border-2 text-left font-semibold transition-all ${selectedAnswer === answer
                        ? 'border-gold-primary bg-gold-primary/20 text-gold-primary gold-border-glow'
                        : 'border-gold-primary/30 hover:border-gold-primary/70 text-white bg-navy-primary/50'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {answer}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 bg-black border border-gold-primary/20 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm text-white font-semibold">
                  <span>{competition.soldTickets} Tickets Sold</span>
                  <span className="text-gold-primary">{remainingTickets} Remaining</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-4 overflow-hidden border border-gold-primary/20">
                  <motion.div
                    className="h-full gold-gradient rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressRounded}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  ></motion.div>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-b border-gold-primary/10 py-4 bg-black rounded-lg px-4">
                {originalPriceDisplay && (
                  <p className="text-lg text-white/60 line-through mb-2">
                    Was £{originalPriceDisplay}
                  </p>
                )}
                <p className="text-4xl font-light text-gold-primary  gold-text-glow">
                  Now £{ticketPriceDisplay}
                </p>
              </div>

              {/* Ticket Quantity Selector */}
              <div className="space-y-3 bg-black border border-gold-primary/20 p-4 rounded-lg">
                <p className="font-semibold text-white">Choose Ticket Quantity:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementTickets}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gold-primary/50 rounded hover:border-gold-primary hover:bg-gold-primary/10 transition-colors text-gold-primary"
                  >
                    <FaMinus className="w-3 h-3" />
                  </button>

                  <div className="flex-1 bg-black/50 rounded-lg p-3 border border-gold-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/80 font-semibold">Qty:</span>
                      <span className="text-lg font-bold text-gold-primary">{ticketQuantity}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(Number(e.target.value))}
                      className="w-full accent-gold-primary"
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>1</span>
                      <span>20</span>
                    </div>
                  </div>

                  <button
                    onClick={incrementTickets}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gold-primary/50 rounded hover:border-gold-primary hover:bg-gold-primary/10 transition-colors text-gold-primary"
                  >
                    <FaPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end bg-black border border-gold-primary/20 p-4 rounded-lg">
                <div className="text-right">
                  <p className="text-sm text-white/80 font-semibold mb-1">Total</p>
                  <p className="text-4xl font-light text-gold-primary  gold-text-glow">
                    £{totalPrice}
                  </p>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={isAddToCartDisabled}
                  withBrackets
                >
                  {validateAnswerMutation.isPending || isCartLoading
                    ? "Processing..."
                    : "Add to Cart"}
                </Button>
                <Link
                  to="/"
                  className="block text-center text-gold-primary hover:text-gold-light font-semibold transition-colors"
                >
                  Free Entry Route Available
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Overview */}
      <section className="py-[60px] bg-black border-t border-gold-primary/10">
        <div className="max-w-[1267px] mx-auto px-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-light text-white  gold-text-glow">
                Competition Overview
              </h3>
              <p className="text-xl text-white font-semibold">
                You could CLAIM this Incredible {competition.title}
              </p>

              <ul className="space-y-3">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-primary flex items-center justify-center flex-shrink-0 border border-gold-primary/50">
                      <FaCheck className="w-4 h-4 text-navy-primary" />
                    </div>
                    <span className="text-white font-semibold">{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="text-white font-semibold">
                1st Draw: {competition.title}
              </p>
            </div>

            <div className="rounded-lg overflow-hidden border border-gold-primary/20">
              <img
                src={competition.images[0]?.url}
                alt={competition.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-[60px] bg-black">
        <div className="max-w-[1267px] mx-auto px-[60px]">
          <div className="max-w-4xl">
            <h4 className="text-2xl font-light text-white  mb-6 gold-text-glow">
              Check out what's included!
            </h4>
            <p className="text-white/90 text-lg mb-8">
              {competition.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {included.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-black border border-gold-primary/20 p-3 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-gold-primary flex items-center justify-center flex-shrink-0 border border-gold-primary/50">
                    <FaCheck className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-white font-semibold">{item}</span>
                </div>
              ))}
            </div>

            {specs.length > 0 && (
              <div className="mt-8 border border-gold-primary/20 rounded-lg divide-y divide-gold-primary/10">
                {specs.map((spec, idx) => (
                  <div
                    key={`${spec.label}-${idx}`}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-4 py-3 text-white/80"
                  >
                    <span className="font-semibold text-white">{spec.label}</span>
                    <span>{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Competition Rules */}
      <section className="py-[60px] bg-black border-t border-gold-primary/10">
        <div className="max-w-[1267px] mx-auto px-[60px]">
          <h3 className="text-3xl font-bold text-white font-['Spectral'] mb-6 gold-text-glow">
            Competition rules & details
          </h3>

          <div className="space-y-4 text-white/90">
            <p className="leading-relaxed">
              While taking part or entering this competition you will have to agree to our{' '}
              <Link to="/terms" className="text-gold-primary hover:text-gold-light font-bold underline">
                Terms & Conditions
              </Link>
              , please read and understand our rules and regulations. We do provide a free entry method to our competitions, please see Terms Section 3.10.
            </p>

            <p className="leading-relaxed">
              Contests are not sponsored, endorsed or administered by, or associated with Facebook in any way and entrants release Facebook completely by participating.
            </p>

            <p className="leading-relaxed">
              We only will accept entries into the competitions where the question is answered correctly. All incorrect answers will not be entered into the competition.
            </p>

            <p className="leading-relaxed">
              The Maximum entries for this competition is {competition.maxTickets}
            </p>

            <p className="leading-relaxed">
              There are currently {remainingTickets} tickets left on this Competition.
            </p>

            <p className="leading-relaxed font-semibold text-gold-primary">
              <strong>Note:</strong> Please ensure you have read and understood all the terms and conditions before entering this competition.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompetitionDetail;
