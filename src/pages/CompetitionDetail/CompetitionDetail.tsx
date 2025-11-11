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
// import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "../../components/common/Button/Button";
// import { competitionService } from "../../services";
import { useCartStore } from "../../store/useCartStore";
import { DUMMY_COMPETITIONS } from "../../data/dummyData";

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

  // Commented out API calls - using dummy data
  // const {
  //   data: competition,
  //   isLoading: isCompetitionLoading,
  //   isError: isCompetitionError,
  //   error: competitionError,
  // } = useQuery({
  //   queryKey: ["competition", id],
  //   queryFn: () => {
  //     if (!id) {
  //       throw new Error("Missing competition id");
  //     }
  //     return competitionService.getCompetitionById(id);
  //   },
  //   enabled: Boolean(id),
  //   staleTime: 60_000,
  // });

  // const { data: competitionProgress } = useQuery({
  //   queryKey: ["competition", id, "progress"],
  //   queryFn: () => {
  //     if (!id) {
  //       throw new Error("Missing competition id");
  //     }
  //     return competitionService.getCompetitionProgress(id);
  //   },
  //   enabled: Boolean(id),
  //   staleTime: 30_000,
  // });

  // const validateAnswerMutation = useMutation({
  //   mutationFn: async (answer: string) => {
  //     if (!competition) {
  //       throw new Error("Competition not loaded");
  //     }
  //     return competitionService.validateEntryAnswer(competition.id, answer);
  //   },
  // });

  // Use dummy data
  const dummyCompetition = useMemo(() => {
    const found = DUMMY_COMPETITIONS.find((c) => c.id === id);
    if (!found) return DUMMY_COMPETITIONS[0];
    return found;
  }, [id]);

  const competition = useMemo(() => {
    if (!dummyCompetition) return null;
    return {
      id: dummyCompetition.id,
      title: dummyCompetition.title,
      description: dummyCompetition.description || `Win this amazing ${dummyCompetition.title}!`,
      ticketPrice: dummyCompetition.price,
      originalPrice: dummyCompetition.price * 1.5,
      maxTickets: dummyCompetition.maxTickets,
      soldTickets: dummyCompetition.soldTickets,
      progress: {
        percentage: dummyCompetition.progress,
        soldTickets: dummyCompetition.soldTickets,
        maxTickets: dummyCompetition.maxTickets,
      },
      images: [{ url: dummyCompetition.image }],
      question: {
        question: "What is the capital city of the United Kingdom?",
        options: ["London", "Manchester", "Birmingham", "Edinburgh"],
      },
      features: [
        "Full manufacturer warranty",
        "Premium interior package",
        "Advanced safety features",
        "Latest technology integration",
      ],
      included: [
        "Vehicle registration",
        "Delivery within UK",
        "Full service history",
        "All documentation",
      ],
      specifications: [
        { label: "Engine", value: "V8 Twin-Turbo" },
        { label: "Power", value: "600 HP" },
        { label: "Transmission", value: "Automatic" },
        { label: "Fuel Type", value: "Petrol" },
      ],
      drawDate: dummyCompetition.drawDate,
      startDate: dummyCompetition.startDate,
      endDate: dummyCompetition.endDate,
      status: dummyCompetition.status as any,
      category: dummyCompetition.category,
    };
  }, [dummyCompetition]);

  const competitionProgress = useMemo(() => {
    if (!competition) return null;
    return {
      percentage: competition.progress?.percentage || 0,
      soldTickets: competition.soldTickets || 0,
      maxTickets: competition.maxTickets || 0,
      drawDate: competition.drawDate,
    };
  }, [competition]);

  const isCompetitionLoading = false;
  const isCompetitionError = false;

  // Mock validation - always return true for dummy data
  const validateAnswerMutation = {
    mutateAsync: async (_answer: string) => {
      // Always return true for dummy data
      return Promise.resolve(true);
    },
    isPending: false,
  };

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
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const drawDate = new Date(drawDateIso);
    if (Number.isNaN(drawDate.getTime())) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = drawDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
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
      // toast.error("Competition not found");
      return;
    }
    if (!selectedAnswer) {
      toast.error("Please select an answer first");
      return;
    }

    try {
      // For dummy data, always validate as correct
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
      // Commented out error toast for dummy data
      // const message =
      //   error instanceof Error ? error.message : "Unable to add tickets to cart.";
      // toast.error(message);
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
    // For dummy data, always show competition (fallback to first one)
    if (!competition) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center space-y-4 px-6">
            <h1 className="text-3xl font-bold text-navy-light">Competition unavailable</h1>
            <p className="text-navy-primary">Unable to load competition.</p>
            <Link
              to="/competitions"
              className="inline-block text-gold-primary hover:text-gold-light font-semibold transition-colors gold-link"
            >
              Back to Competitions
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Countdown Banner */}
      <section className="bg-black border-b border-gold-primary/30 py-8">
        <div className="max-w-[1267px] mx-auto px-[60px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-navy-light gold-text-glow">
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
                  className="flex flex-col items-center bg-gold-primary/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[80px] border border-gold-primary/50 gold-hover-glow"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-3xl font-bold text-gold-primary gold-text-glow">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-gold-primary font-bold uppercase">{item.label}</span>
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
                <div className="relative h-[500px] rounded-lg overflow-hidden bg-black border border-gold-primary/30">
                  <img
                    src={currentImage?.url ?? FALLBACK_IMAGE}
                    alt={competition.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-gold-primary/90 hover:bg-gold-primary text-black p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg gold-glow"
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-gold-primary/90 hover:bg-gold-primary text-black p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg gold-glow"
                  >
                    <FaChevronRight className="w-5 h-5" />
                  </button>

                  {/* Draw Date Badge */}
                  <div className="absolute top-4 left-4 bg-[#00FF85] px-4 py-2 rounded-full shadow-lg border border-[#00FF85] electric-green-glow">
                    <p className="text-black text-sm font-bold uppercase">
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
              <div className="space-y-4 bg-black-soft border border-gold-primary/30 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaQuestionCircle className="w-5 h-5 text-gold-primary" />
                  <h3 className="text-2xl font-bold text-navy-light">
                    {question?.question ?? "Answer the skill-based question"}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {answerOptions.map((answer, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setSelectedAnswer(answer)}
                      className={`px-4 py-3 rounded-lg border-2 text-left font-bold transition-all ${selectedAnswer === answer
                        ? 'border-gold-primary bg-gold-primary/20 text-gold-primary gold-border-glow'
                        : 'border-gold-primary/30 hover:border-gold-primary/70 text-navy-light bg-black'
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
              <div className="space-y-2 bg-black-soft border border-gold-primary/30 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm text-navy-light font-bold">
                  <span>{soldTickets.toLocaleString()} Tickets Sold</span>
                  <span className="text-gold-primary gold-text-glow">{remainingTickets.toLocaleString()} Remaining</span>
                </div>
                <div className="w-full bg-black rounded-full h-4 overflow-hidden border border-gold-primary/30">
                  <motion.div
                    className="h-full gold-gradient rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressRounded}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ boxShadow: '0 0 6px rgba(0, 112, 243, 0.6)' }}
                  ></motion.div>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-b border-gold-primary/30 py-4 bg-black-soft rounded-lg px-4">
                {originalPriceDisplay && (
                  <p className="text-lg text-navy-primary line-through mb-2 font-medium">
                    Was £{originalPriceDisplay}
                  </p>
                )}
                <p className="text-4xl font-bold text-gold-primary gold-text-glow">
                  Now £{ticketPriceDisplay}
                </p>
              </div>

              {/* Ticket Quantity Selector */}
              <div className="space-y-3 bg-black-soft border border-gold-primary/30 p-4 rounded-lg">
                <p className="font-bold text-navy-light">Choose Ticket Quantity:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementTickets}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gold-primary/50 rounded hover:border-gold-primary hover:bg-gold-primary/10 transition-colors text-gold-primary gold-hover-glow"
                  >
                    <FaMinus className="w-3 h-3" />
                  </button>

                  <div className="flex-1 bg-black rounded-lg p-3 border border-gold-primary/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-navy-primary font-semibold">Qty:</span>
                      <span className="text-lg font-bold text-gold-primary gold-text-glow">{ticketQuantity}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(Number(e.target.value))}
                      className="w-full accent-gold-primary"
                    />
                    <div className="flex justify-between text-xs text-navy-primary mt-1 font-medium">
                      <span>1</span>
                      <span>20</span>
                    </div>
                  </div>

                  <button
                    onClick={incrementTickets}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gold-primary/50 rounded hover:border-gold-primary hover:bg-gold-primary/10 transition-colors text-gold-primary gold-hover-glow"
                  >
                    <FaPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end bg-black-soft border border-gold-primary/30 p-4 rounded-lg">
                <div className="text-right">
                  <p className="text-sm text-navy-primary font-semibold mb-1">Total</p>
                  <p className="text-4xl font-bold text-gold-primary gold-text-glow">
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
      <section className="py-[60px] bg-black-soft border-t border-gold-primary/30">
        <div className="max-w-[1267px] mx-auto px-[60px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-navy-light gold-text-glow">
                Competition Overview
              </h3>
              <p className="text-xl text-navy-light font-bold">
                You could CLAIM this Incredible {competition.title}
              </p>

              <ul className="space-y-3">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-primary flex items-center justify-center flex-shrink-0 border border-gold-primary/50 gold-glow">
                      <FaCheck className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-navy-light font-bold">{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="text-navy-light font-bold">
                1st Draw: {competition.title}
              </p>
            </div>

            <div className="rounded-lg overflow-hidden border border-gold-primary/30 gold-border-glow">
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
            <h4 className="text-2xl font-bold text-navy-light mb-6 gold-text-glow">
              Check out what's included!
            </h4>
            <p className="text-navy-primary text-lg mb-8 font-medium">
              {competition.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {included.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-black-soft border border-gold-primary/30 p-3 rounded-lg gold-hover-glow">
                  <div className="w-6 h-6 rounded-full bg-gold-primary flex items-center justify-center flex-shrink-0 border border-gold-primary/50 gold-glow">
                    <FaCheck className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-navy-light font-bold">{item}</span>
                </div>
              ))}
            </div>

            {specs.length > 0 && (
              <div className="mt-8 border border-gold-primary/30 rounded-lg divide-y divide-gold-primary/30">
                {specs.map((spec, idx) => (
                  <div
                    key={`${spec.label}-${idx}`}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-4 py-3 text-navy-primary bg-black-soft"
                  >
                    <span className="font-bold text-navy-light">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Competition Rules */}
      <section className="py-[60px] bg-black-soft border-t border-gold-primary/30">
        <div className="max-w-[1267px] mx-auto px-[60px]">
          <h3 className="text-3xl font-bold text-navy-light mb-6 gold-text-glow">
            Competition rules & details
          </h3>

          <div className="space-y-4 text-navy-primary font-medium">
            <p className="leading-relaxed">
              While taking part or entering this competition you will have to agree to our{' '}
              <Link to="/legal/terms" className="text-gold-primary hover:text-gold-light font-bold underline gold-link">
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
              The Maximum entries for this competition is {competition.maxTickets.toLocaleString()}
            </p>

            <p className="leading-relaxed">
              There are currently {remainingTickets.toLocaleString()} tickets left on this Competition.
            </p>

            <p className="leading-relaxed font-bold text-gold-primary gold-text-glow">
              <strong>Note:</strong> Please ensure you have read and understood all the terms and conditions before entering this competition.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompetitionDetail;
